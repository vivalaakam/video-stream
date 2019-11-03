const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { NODE_ENV = 'development', WEBPACK_PORT = 3001 } = process.env
const __DEV__ = NODE_ENV === 'development'

const config = {
    entry: {
        bundle: [
            // __DEV__ ? 'react-dev-utils/webpackHotDevClient' : null,
            path.resolve(__dirname, './src/index.js'),
        ].filter(Boolean),
    },

    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'index.js',
        publicPath: '/',
    },

    devtool: __DEV__ ? 'eval-source-map' : 'source-map',
    mode: __DEV__ ? 'development' : 'production',
    optimization: {
        minimize: !__DEV__,
        mergeDuplicateChunks: !__DEV__,
    },

    resolve: {
        extensions: ['.js'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: __DEV__
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',

                        options: {
                            // Necessary for external CSS imports to work
                            // https://github.com/facebook/create-react-app/issues/2677
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                require('postcss-preset-env')({
                                    autoprefixer: {
                                        flexbox: 'no-2009',
                                    },
                                    stage: 3,
                                }),
                            ],
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
    ],
    devServer: {
        port: WEBPACK_PORT,
        compress: true,
    }
}

module.exports = config
