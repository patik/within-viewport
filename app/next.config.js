/* eslint-disable @typescript-eslint/no-var-requires */
const mdx = require('@next/mdx')
const { config } = require('./package.json')

const withMDX = mdx({
    extension: /\.mdx?$/,
})

const { basePath } = config

/** @type {import('next').NextConfig} */
module.exports = withMDX({
    reactStrictMode: true,
    swcMinify: true,
    basePath,
    // Add markdown extensions
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    images: {
        unoptimized: true,
    },
})
