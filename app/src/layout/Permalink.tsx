import CloseIcon from '@mui/icons-material/Close'
import { Portal } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

function usePermalink(): string {
    const [fullUrl, setFullUrl] = useState('')

    useEffect(() => {
        const onHashChange = () => {
            setFullUrl(window.location.href)
        }

        window.addEventListener('hashchange', onHashChange)

        return () => window.removeEventListener('hashchange', onHashChange)
    })

    return fullUrl
}

export default function Permalink() {
    const fullUrl = usePermalink()

    const [open, setOpen] = useState(false)

    const handleClick = (_text: string, result: boolean) => {
        if (result) {
            setOpen(true)
        }
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
    }

    const action = (
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
        </IconButton>
    )

    return (
        <>
            <CopyToClipboard text={fullUrl} onCopy={handleClick}>
                <a
                    href={fullUrl}
                    onClick={(e) => {
                        // Allow opening in a new tab
                        if (!e.metaKey) {
                            e.preventDefault()
                        }
                    }}
                >
                    Link to this comparison
                </a>
            </CopyToClipboard>
            {/* Use Portal to prevent this <div> from being a descendant of the <p> that holds this link */}
            <Portal>
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    message="Copied to clipboard"
                    action={action}
                />
            </Portal>
        </>
    )
}
