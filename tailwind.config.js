// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
            },
            typography: (theme) => ({
                xl: {
                    css: {
                        color: theme('colors.gray.700'),
                        h1: { color: theme('colors.gray.700'), fontWeight: '700' },
                        h2: { color: theme('colors.gray.700'), fontWeight: 'bold' },
                        h3: { color: theme('colors.gray.700'), fontWeight: 'bold' },
                        h4: { color: theme('colors.gray.700'), fontWeight: 'bold' },
                        h5: { color: theme('colors.gray.700'), fontWeight: 'bold' },
                        h6: { color: theme('colors.gray.700'), fontWeight: 'bold' },
                        p: { color: theme('colors.gray.700') },
                        code: {
                            display: 'inline-block',
                            background: theme('colors.gray.200'),
                            borderRadius: theme('borderRadius.lg'),
                            paddingRight: theme('spacing.1'),
                            paddingLeft: theme('spacing.1'),
                            fontWeight: theme('fontWeight.normal'),
                            '&:before': {
                                display: 'none',
                            },
                            '&:after': {
                                display: 'none',
                            },
                        },
                    },
                },
                editor: {
                    css: {
                        h1: { margin: 0 },
                        h2: { margin: 0 },
                        h3: { margin: 0 },
                        h4: { margin: 0 },
                        h5: { margin: 0 },
                        h6: { margin: 0 },
                        p: { margin: 0 },
                    },
                },
            }),
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/typography')],
};
