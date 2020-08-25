import { GenericObject } from '../type';
import {
    containerStyleParser,
    fillColorParser,
    gridStyleParser,
    rectangleStyleParser,
    styleParser,
    vectorStyleParser,
} from './style';

/**
 * converter to html
 * @param filePath - json figma api output path
 * @param nodeId - figma node_id
 */
export const convertToHTML = (jsonOutput: GenericObject, nodeId: string) => {
    try {
        let htmlString: string = '';
        const doc: GenericObject = jsonOutput.nodes[nodeId]['document'];
        const children = doc.children;

        htmlString += getHtmlHeader(doc, nodeId);
        htmlString += generator('', children);
        htmlString += getHtmlFooter();

        return htmlString;
    } catch (err) {
        throw new Error('[converter] error when convert to HTML');
    }
};

/**
 * get html header
 * @param nodeId - nodeId
 */
const getHtmlHeader = (doc: GenericObject, nodeId: string) => {
    const mainStyle = gridStyleParser(doc.layoutGrids);
    const inlineStyle = mainStyle ? `style="${mainStyle}"` : '';
    return `<!DOCTYPE html>
    <html id="figma-generated-${new Date().getTime()}">
    <head>
    <title>Figma HTML Generated - ${nodeId}</title>
    </head>
    <body id="${nodeId}" ${inlineStyle}>`;
};

/**
 * get html footer
 */
const getHtmlFooter = () => {
    return `</body>
    </html>`;
};

/**
 * node iterator
 * @param htmlString - html string
 * @param nodes - array of node
 */
const generator = (htmlString: string, nodes: Array<GenericObject>): string => {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const type = node.type;
        const nodeId = node.id;
        const child = nodes[i].children;

        htmlString += typeDispatcher(type, node);

        if (Array.isArray(child)) {
            const containerStyle = containerStyleParser(node);
            const inlineStyle = containerStyle ? `style="${containerStyle}"` : '';
            htmlString += `<div id="${nodeId}" ${inlineStyle}>`;
            htmlString += generator('', child);
            htmlString += '</div>';
        }
    }
    return htmlString;
};

/**
 * type dispatcher to generate HTML
 * @param type - node type
 */
const typeDispatcher = (type: string, node: GenericObject): string => {
    switch (type) {
        case 'TEXT': {
            return textGenerator(node);
        }
        case 'VECTOR': {
            return vectorGenerator(node);
        }
        case 'RECTANGLE' || 'FRAME': {
            return rectangleGenerator(node);
        }
        default: {
            return uknownType(node);
        }
    }
};

/**
 * writer for TYPE: TEXT
 * @param node - node figma
 */
const textGenerator = (node: GenericObject): string => {
    const text: string = node.characters;
    const id = node.id;
    let styles: string = '';

    // set common style
    const style = styleParser(node.style);
    styles += style;

    // set background style
    const backGroundStyle = fillColorParser(node.fills);
    styles += backGroundStyle;

    // set  containerStyle
    const containerStyle = containerStyleParser(node);
    styles += containerStyle;

    const inlineStyle = style ? `style="${styles}"` : '';
    const normalizeText = text.replace(/\n/, '<br/>');
    return `<div id="${id}" ${inlineStyle}>${normalizeText}</div> \n`;
};

/**
 * writer for TYPE: TEXT
 * @param node - node figma
 */
const vectorGenerator = (node: GenericObject): string => {
    const id = node.id;
    const style = vectorStyleParser(node);
    const inlineStyle = style ? `style="${style}"` : '';
    return `<div id="${id}" ${inlineStyle}></div> \n`;
};

/**
 * TODO: need still workaround for this
 * writer for TYPE: RECTANGLE
 * @param node - node figma
 */
const rectangleGenerator = (node: GenericObject) => {
    let styles: string = '';

    const id = node.id;
    const rectangleStyle = rectangleStyleParser(node);
    styles += rectangleStyle;

    const containerStyle = containerStyleParser(node);
    styles += containerStyle;

    const inlineStyle = styles ? `style="${styles}"` : '';

    return `<div id="${id}" ${inlineStyle}></div> \n`;
};

/**
 * writer for unkownn/undeclare type
 * @param node - node figma
 */
const uknownType = (node?: GenericObject): string => '';
