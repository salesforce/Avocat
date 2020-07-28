const DEFAULT_INDENTATION = '  ';

export function indentation(level = 0): string {
    return DEFAULT_INDENTATION.repeat(level + 1);
}