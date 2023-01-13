import { Collapse, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import { Box } from '@mui/system'
import useDoFStore from '../../../../store'

export default function DepthOfFieldDetails({ lens, open }: { lens: LensDefinition; open: boolean }) {
    const { units } = useDoFStore()

    return (
        <MuiTableRow className="dof-detail-row">
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Depth of field (DoF) details
                        </Typography>
                        <Table size="small" aria-label="depth of field details">
                            <TableHead>
                                <MuiTableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Value</TableCell>
                                </MuiTableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow key="dof">
                                    <TableCell component="th" scope="row">
                                        {`Total length of the depth of field (${units === 'metric' ? 'm' : 'ft'})`}
                                    </TableCell>
                                    <TableCell align="right" data-testid="dof-precise">
                                        {lens.depthOfField.dof}
                                    </TableCell>
                                </TableRow>
                                <TableRow key="eighthDof">
                                    <TableCell component="th" scope="row">
                                        {`One-eighth of the depth of field (${units === 'metric' ? 'm' : 'ft'})`}
                                    </TableCell>
                                    <TableCell align="right">{lens.depthOfField.eighthDof}</TableCell>
                                </TableRow>
                                <TableRow key="focalLengthEquiv">
                                    <TableCell component="th" scope="row">
                                        {`Focal length in 35mm-equivalency (${units === 'metric' ? 'mm' : 'ft'})`}
                                    </TableCell>
                                    <TableCell align="right">{lens.depthOfField.focalLengthEquiv}</TableCell>
                                </TableRow>
                                <TableRow key="hf">
                                    <TableCell component="th" scope="row">
                                        {`Hyperfocal distance (${units === 'metric' ? 'm' : 'ft'})`}
                                    </TableCell>
                                    <TableCell align="right">{lens.depthOfField.hf}</TableCell>
                                </TableRow>
                                <TableRow key="near">
                                    <TableCell component="th" scope="row">
                                        {`DoF near limit (${units === 'metric' ? 'm' : 'ft'})`}
                                    </TableCell>
                                    <TableCell align="right">{lens.depthOfField.near}</TableCell>
                                </TableRow>
                                <TableRow key="far">
                                    <TableCell component="th" scope="row">
                                        {`DoF far limit (${units === 'metric' ? 'm' : 'ft'})`}
                                    </TableCell>
                                    <TableCell align="right">{lens.depthOfField.far}</TableCell>
                                </TableRow>
                                <TableRow key="coc">
                                    <TableCell component="th" scope="row">
                                        {`Circle of confusion (${units === 'metric' ? 'mm' : 'ft'})`}
                                    </TableCell>
                                    <TableCell align="right">{lens.depthOfField.coc}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </MuiTableRow>
    )
}
