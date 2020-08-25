import { GenericObject } from '../type';

const EXCLUDE_KEYS: Array<string> = [
    'font-post-script-name',
    'line-height-px',
    'line-height-percent',
    'line-height-percent-font-size',
];

const STYLE_KEYS_MAP: { [key: string]: string } = {
    textAlignHorizontal: 'text-align',
    textAlignVertical: 'vertical-align',
};

const IS_PIXEL_UNITS: { [key: string]: boolean } = {
    'font-size': true,
};

/**
 * return style inline
 * @param style - style object from figma api
 */
export const styleParser = (style: GenericObject): string => {
    return Object.keys(style)
        .map((k: string) => {
            const val: any = style[k];
            const key: string = camelToSnakeCase(k);
            const isInvalidKey = EXCLUDE_KEYS.includes(key);

            // check for converted style
            const convertedKey = STYLE_KEYS_MAP[k];
            if (convertedKey) {
                return `${convertedKey}: ${val.toLowerCase()};`;
            }

            // check for style value that uppercase that cannot be mapped
            if (typeof val === 'string' && val === val.toUpperCase()) {
                return '';
            }

            // check for invalid key
            if (isInvalidKey) {
                return '';
            }

            const valueUnit = IS_PIXEL_UNITS[key] ? `${val}px` : val;
            return `${key}: ${valueUnit};`;
        })
        .join('');
};

/**
 * container style parser
 * @param node
 */
export const containerStyleParser = (node: GenericObject) => {
    let style = '';

    // set background
    if (node.backgroundColor && node.blendMode !== 'PASS_THROUGH') {
        const { r, g, b, a } = node.backgroundColor;
        const backGround = `background-color: rgba(${r}, ${g}, ${b}, ${a});`;
        style += backGround;
    }

    // set padding
    if (node.verticalPadding || node.horizontalPadding) {
        const topBottomPadding = node.verticalPadding || 0;
        const leftRightPadding = node.horizontalPadding || 0;
        style += `padding: ${topBottomPadding}px ${leftRightPadding}px;`;
    }

    return style;
};

/**
 * vector style parser
 * @param node
 */
export const vectorStyleParser = (node: GenericObject): string => {
    let style = '';

    // set color
    if (Boolean(node?.fills[0]?.color)) {
        const color = fillColorParser(node?.fills || [], 'background');
        style += color;
    }

    return style;
};

/**
 * fill color parser
 * @param fills
 * @param variable
 */
export const fillColorParser = (fills: Array<any>, variable: string = 'color'): string => {
    if (fills[0]) {
        const { r, g, b, a } = fills[0]?.color || { color: { r: 0, g: 0, b: 0, a: 0 } };
        if (variable === 'border') {
            const type: string = fills[0]?.type || 'solid';
            const borderStyle = `border: 1px ${type.toLowerCase()} rgba(${r}, ${g}, ${b}, ${a});`;
            return borderStyle;
        }
        const colorStyle = `${variable}: rgba(${r}, ${g}, ${b}, ${a});`;
        return colorStyle;
    }
    return '';
};

/**
 * grid style parser
 * @param grids
 */
export const gridStyleParser = (grids: Array<any>): string => {
    if (!grids || grids.length === 0) {
        return '';
    }

    const grid = grids[0] || {};
    if (grid.visible) {
        let style: string = '';

        // set grid pattern
        const display = 'display';
        const gridPattern = grid.pattern === 'COLUMNS' ? `${display}: inline-grid;` : `${display}: grid;`;
        style += gridPattern;

        // set grid gap
        const gapSize = grid.gutterSize;
        const gridGap = `grid-gap: ${gapSize}px;`;
        style += gridGap;
        return style;
    }

    return '';
};

/**
 * rectangle style parser
 * @param node
 */
export const rectangleStyleParser = (node: GenericObject): string => {
    let style: string = '';

    // set color
    if (Boolean(node.fills[0]?.color)) {
        const color = fillColorParser(node?.fills || []);
        style += color;
    }

    // set border radius
    if (node.rectangleCornerRadii && node.rectangleCornerRadii.length !== 0) {
        const [t, r, b, l] = node.rectangleCornerRadii;
        const radius = `border-radius: ${t}px ${r}px ${b}px ${l}px;`;
        style += radius;
    }

    return style;
};

/**
 * camel to snake case
 * @param str
 * @param separator
 */
const camelToSnakeCase = (str: string, separator: string = '-'): string =>
    str.replace(/[A-Z]/g, (letter) => `${separator}${letter.toLowerCase()}`);
