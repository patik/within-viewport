import { Typography } from '@mui/material'
import Readme from '../../../README.md'
import Layout from '../../src/layout/Layout'

export default function Software() {
    return (
        <Layout title="Software: Node.js Package" noMainHeading>
            <Typography component="div">
                <Readme />
            </Typography>
        </Layout>
    )
}
