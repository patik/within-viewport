import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ResponsiveLine, Serie } from '@nivo/line'
import useDoFStore from '../../store'
import { feetAndInchesString, feetString } from '../../utilities/conversion'
import useData from './useData'

export default function Graph() {
    const { units } = useDoFStore()
    const theme = useTheme()
    const data: Serie[] = useData()

    return (
        <ResponsiveLine
            data={data}
            colors={{ scheme: 'nivo' }}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear' }}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                legend: `Distance (${units === 'imperial' ? 'ft' : 'm'})`,
                legendOffset: 42,
                legendPosition: 'middle',
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: `Depth of field length (${units === 'imperial' ? 'ft' : 'm'})`,
                legendOffset: -56,
                legendPosition: 'middle',
            }}
            pointSize={10}
            pointColor={{ theme: 'labels.text.fill' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            theme={{
                legends: {
                    title: {
                        text: {
                            fill: theme.palette.text.primary,
                        },
                    },
                },
                axis: {
                    legend: {
                        text: {
                            fill: theme.palette.text.primary,
                        },
                    },
                    ticks: {
                        text: {
                            fill: theme.palette.text.primary,
                        },
                    },
                },
                tooltip: {
                    container: {
                        background: '#000',
                    },
                },
            }}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 24,
                    itemOpacity: 1,
                    itemTextColor: theme.palette.text.primary,
                    symbolSize: 16,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, 0.5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, 0.5)',
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
            tooltip={(props) => {
                const name = props.point.serieId
                const dof = Number(props.point.data.yFormatted)
                const dofText = units === 'imperial' ? `${feetAndInchesString(dof)}` : `${dof} meters`
                const dist = props.point.data.xFormatted
                const distText = units === 'imperial' ? `${feetString(Number(dist))} away` : `${dist} meters away`

                return (
                    <Box
                        sx={{
                            bgcolor: props.point.borderColor,
                            p: 2,
                            borderRadius: (theme) => theme.shape.borderRadius,
                        }}
                    >
                        <Typography
                            sx={{
                                color: (theme) => theme.palette.getContrastText(props.point.borderColor),
                            }}
                        >
                            {name}
                        </Typography>
                        <Typography
                            sx={{
                                color: (theme) => theme.palette.getContrastText(props.point.borderColor),
                            }}
                        >{`DoF is ${dofText} for a subject that is ${distText}`}</Typography>
                    </Box>
                )
            }}
        />
    )
}
