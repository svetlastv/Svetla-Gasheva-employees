var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            // {
            //     test: /\.less$/i,
            //     use: [{
            //             loader: "style-loader",
            //         },
            //         {
            //             loader: "css-loader",
            //         },
            //         {
            //             loader: "less-loader",
            //             options: {
            //                 lessOptions: {
            //                     strictMath: true,
            //                 },
            //             },
            //         },
            //     ],
            // },
        ]
    }
};