module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.700'),
                        h1: { color: theme('colors.gray.700') },
                        h2: { color: theme('colors.gray.700') },
                        h3: { color: theme('colors.gray.700') },
                        h4: { color: theme('colors.gray.700') },
                        h5: { color: theme('colors.gray.700') },
                        h6: { color: theme('colors.gray.700') },
                        p: { color: theme('colors.gray.700') },
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
