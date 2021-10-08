module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.700'),
                        h1: { color: theme('colors.gray.700'), marginTop: 0 },
                        h2: { color: theme('colors.gray.700'), marginTop: 0 },
                        h3: { color: theme('colors.gray.700'), marginTop: 0 },
                        h4: { color: theme('colors.gray.700'), marginTop: 0 },
                        h5: { color: theme('colors.gray.700'), marginTop: 0 },
                        h6: { color: theme('colors.gray.700'), marginTop: 0 },
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
                        p: {
                            margin: '0',
                        },
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
