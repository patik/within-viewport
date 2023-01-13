import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { IconButton, Typography } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import { Box } from '@mui/system'
import { useState } from 'react'
import useDoFStore from '../../../../store'
import { metersToFeet, rounded } from '../../../../utilities/conversion'
import { getRowLabelId } from '../../../../utilities/getRowLabelId'
import useIsMobile from '../../../../utilities/useIsMobile'
import DeleteButton from '../DeleteButton'
import Aperture from './Aperture'
import DepthOfFieldDetails from './DepthOfFieldDetails'
import FocalLength from './FocalLength'
import Name from './Name'
import RowCheckbox from './RowCheckbox'
import Sensor from './Sensor'

export default function Row({ lens }: { lens: LensDefinition }) {
    const isMobile = useIsMobile()
    const { units, isSelected } = useDoFStore()
    const displayDof = units === 'imperial' ? metersToFeet(lens.depthOfField.dof) : rounded(lens.depthOfField.dof)
    const isRowSelected = isSelected(lens.id)
    const [open, setOpen] = useState(false)

    return (
        <>
            <MuiTableRow
                hover
                role="checkbox"
                aria-checked={isRowSelected}
                tabIndex={-1}
                key={lens.id}
                selected={isRowSelected}
                className={`lens-table-row`}
                data-testid={`lens-table-row-${lens.id}`}
                sx={
                    isMobile
                        ? {
                              display: 'flex',
                              flexWrap: 'wrap',
                              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                              my: 2,
                              pb: 2,
                          }
                        : undefined
                }
            >
                {isMobile ? null : (
                    <TableCell padding="checkbox">
                        <RowCheckbox lens={lens} />
                    </TableCell>
                )}
                <TableCell
                    component="th"
                    id={getRowLabelId(lens)}
                    scope="row"
                    padding="none"
                    sx={
                        isMobile
                            ? {
                                  minWidth: '100%',
                                  p: 2,
                                  border: 'none',
                              }
                            : undefined
                    }
                >
                    <Name lens={lens} />
                </TableCell>
                <TableCell
                    align={isMobile ? undefined : 'right'}
                    sx={
                        isMobile
                            ? {
                                  width: '50%',
                                  border: 'none',
                                  pr: 0,
                                  mb: 1,
                              }
                            : undefined
                    }
                >
                    <FocalLength lens={lens} />
                </TableCell>
                <TableCell
                    align={isMobile ? undefined : 'right'}
                    sx={
                        isMobile
                            ? {
                                  width: '50%',
                                  border: 'none',
                              }
                            : undefined
                    }
                >
                    <Aperture lens={lens} />
                </TableCell>
                <TableCell
                    align={isMobile ? undefined : 'right'}
                    sx={
                        isMobile
                            ? {
                                  minWidth: '100%',
                                  border: 'none',
                                  mb: 1,
                              }
                            : undefined
                    }
                >
                    <Sensor lens={lens} />
                </TableCell>
                <TableCell
                    align={isMobile ? undefined : 'right'}
                    data-testid={`dof-${lens.id}`}
                    sx={
                        isMobile
                            ? {
                                  marginBottom: 2,
                                  border: 'none',
                                  width: '100%',
                              }
                            : undefined
                    }
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={isMobile ? { alignItems: 'center' } : { width: '100%' }}
                    >
                        <Typography sx={{ flexGrow: 1, mr: 1 }}>{`${
                            isMobile ? 'Depth of field: ' : ''
                        }${displayDof}`}</Typography>
                        {isMobile ? <DeleteButton lenses={[lens.id]} /> : null}
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </Box>
                </TableCell>
            </MuiTableRow>
            <DepthOfFieldDetails lens={lens} open={open} />
        </>
    )
}
