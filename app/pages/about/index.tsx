import { Box, BoxProps, Divider, Grid, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import addOrDuplicate from '../../public/images/add-duplicate.png'
import detailsImg from '../../public/images/details.png'
import PrintedTextShallowDoF from '../../public/images/printed-text-shallow-dof.jpg'
import sharingImg from '../../public/images/sharing.png'
import singleLensImg from '../../public/images/single-lens.png'
import Tree_bud_at_f22 from '../../public/images/Tree_bud_at_f22.jpg'
import Tree_bud_in_spring_f18 from '../../public/images/Tree_bud_in_spring_f1.8.jpg'
import withGraphImg from '../../public/images/with-graph.png'
import Layout from '../../src/layout/Layout'
import useIsMobile from '../../src/utilities/useIsMobile'

function Figure({ narrow, children, ...props }: PropsWithChildren & BoxProps & { narrow?: boolean }) {
    return (
        <Box component="figure" maxWidth={narrow ? '300px' : undefined} {...props}>
            {children}
        </Box>
    )
}

function Space() {
    return <>{` `}</>
}

export default function About() {
    const isMobile = useIsMobile()

    return (
        <Layout title="About">
            <Box mb={3}>
                <Typography variant="h2" gutterBottom>
                    What is depth of field?
                </Typography>
                <Typography gutterBottom>
                    The <a href="https://en.wikipedia.org/wiki/Depth_of_field">depth of field (DoF)</a> is the area of
                    an image&mdash;between the foreground and background&mdash;where objects are in acceptably sharp
                    focus. This is commonly used to affect a photo’s aesthetics, e.g. with
                    <Space />
                    <a href="https://en.wikipedia.org/wiki/Bokeh">bokeh</a>.
                </Typography>
                <Figure textAlign="center">
                    <Image
                        src={PrintedTextShallowDoF}
                        width={997}
                        height={717}
                        sizes="100vw"
                        style={{
                            width: isMobile ? '100%' : '60%',
                            height: 'auto',
                        }}
                        alt="A page of text with the middle section in focus, and the foreground and background out of focus"
                    />
                    <figcaption>
                        <Typography gutterBottom>The clear part of this image represents the depth of field</Typography>
                        <Typography
                            variant="caption"
                            component="a"
                            href="https://en.wikipedia.org/wiki/File:DOF-ShallowDepthofField.jpg"
                        >
                            Image from Wikipedia
                        </Typography>
                    </figcaption>
                </Figure>
                <Typography gutterBottom>
                    Depth of field is affected by the camera’s sensor size, the lens’ aperture, and the lens’ focal
                    length (or zoom). Larger sensors, longer focal lengths (being more zoomed in), and larger apertures
                    yield a shallower (smaller, tighter) depth of field.
                </Typography>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <Figure>
                            <Image
                                src={Tree_bud_in_spring_f18}
                                height={427}
                                width={640}
                                sizes="100vw"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                }}
                                alt="A bud on a tree branch, which is the only part that's in focus, taken at f/1.8"
                            />
                            <figcaption>
                                <Typography gutterBottom>Narrow (small) depth of field</Typography>
                                <Typography
                                    variant="caption"
                                    component="a"
                                    href="https://en.wikipedia.org/wiki/File:Tree_bud_in_spring_f1.8.jpg"
                                >
                                    Image from Wikipedia
                                </Typography>
                            </figcaption>
                        </Figure>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Figure>
                            <Image
                                src={Tree_bud_at_f22}
                                height={427}
                                width={640}
                                sizes="100vw"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                }}
                                alt="A bud on a tree branch, taken at f/22; nearly everything is in focus here, so the bud doesn't stand out very much"
                            />
                            <figcaption>
                                <Typography gutterBottom>Deep (large) depth of field</Typography>
                                <Typography
                                    variant="caption"
                                    component="a"
                                    href="https://en.wikipedia.org/wiki/File:Tree_bud_at_f22.jpg"
                                >
                                    Image from Wikipedia
                                </Typography>
                            </figcaption>
                        </Figure>
                    </Grid>
                </Grid>
            </Box>
            <Box mb={3}>
                <Typography variant="h2" id="calculate" gutterBottom>
                    Using the calculator
                </Typography>
                <Typography gutterBottom>
                    The <strong>distance</strong> to your subject is configured above the table and it applies to all
                    lenses.
                </Typography>
                <Typography gutterBottom>
                    For a given lens, enter the <strong>focal length</strong>, <strong>aperture</strong>, and the
                    camera’s <strong>sensor size</strong> (or crop factor). The length of the depth of field is
                    displayed within the table and updates as you change the values.
                </Typography>
                <Typography gutterBottom>
                    Focal length values should be in absolute size (millimeters), not the 35mm equivalent.
                </Typography>
                <Figure textAlign="center">
                    <Link href="images/single-lens.png" target="_blank">
                        <Image
                            src={singleLensImg}
                            sizes="100vw"
                            style={{
                                width: isMobile ? '100%' : '50%',
                                height: 'auto',
                            }}
                            alt="Screenshot of lens input"
                        />
                    </Link>
                </Figure>
                <Typography gutterBottom>
                    Be sure to use the <strong>actual focal length</strong> of the lens (e.g. as printed on the front of
                    the lens)&mdash;don’t convert it to the 35mm equivalent.
                </Typography>
                <Typography gutterBottom>
                    Feel free to give each lens a meaningful name to keep track of them.
                </Typography>
                <Typography gutterBottom>
                    The depth of field calculation can be expanded to view more related statistics:
                </Typography>
                <Figure textAlign="center">
                    <Link href="images/details.png" target="_blank">
                        <Image
                            src={detailsImg}
                            sizes="100vw"
                            style={{
                                width: isMobile ? '100%' : '75%',
                                height: 'auto',
                            }}
                            alt="Further details about a lens’ depth of field"
                        />
                    </Link>
                </Figure>
            </Box>
            <Box mb={3}>
                <Typography variant="h2" id="compare" gutterBottom>
                    Comparing lenses
                </Typography>
                <Typography gutterBottom>
                    Click on the “Add Lens” box to add an additional lens, then enter the second lens’ characteristics.
                </Typography>
                <Figure>
                    <Link href="images/add-duplicate.png" target="_blank">
                        <Image
                            src={addOrDuplicate}
                            sizes="100vw"
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                            alt="Comparison of two lenses, with the Add Lens button and Duplicate icon button highlighted"
                        />
                    </Link>
                </Figure>
                <Typography gutterBottom>
                    If the lenses have similar characteristics, you may save time by selecting a lense and clicking the
                    Duplicate button to carry over the same values to a new lens.
                </Typography>
                <Typography gutterBottom>You can add an unlimited number of lenses.</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography gutterBottom>
                    You can also see how lenses compare at various distances from the subject. The graph will display
                    the length of the depth of field at 1-meter (or 5-foot) intervals.
                </Typography>
                <Figure>
                    <Link href="images/with-graph.png" target="_blank">
                        <Image
                            src={withGraphImg}
                            sizes="100vw"
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                            alt="Chart comparing two lenses at various distances"
                        />
                    </Link>
                </Figure>
            </Box>
            <Box mb={3}>
                <Typography variant="h2" id="sharing" gutterBottom>
                    Sharing and saving
                </Typography>
                <Typography gutterBottom>
                    At any time you can copy the address from your browser and send it to a friend. They will see the
                    exact same lenses that you’ve entered.
                </Typography>
                <Typography gutterBottom>
                    You can also bookmark the page to come back to the same lens configuration later.
                </Typography>
                <Figure>
                    <Link href="images/sharing.png" target="_blank">
                        <Image
                            src={sharingImg}
                            sizes="100vw"
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                            alt="screenshot with the browser address bar highlighted"
                        />
                    </Link>
                </Figure>
            </Box>
        </Layout>
    )
}
