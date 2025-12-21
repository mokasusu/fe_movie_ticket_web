const isGitHub = window.location.hostname.includes('github.io');

export const BASE_PATH = isGitHub ? '/cop_cinema' : '';