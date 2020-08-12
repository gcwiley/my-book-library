import React, { useState } from 'react';
import dbConnect from '../../utils/dbConnect';
import Book from '../../models/Book';

// Import Axios
import axios from 'axios';

import { useRouter } from 'next/router';

// Material UI Components
import { Paper, Typography, Button } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';

// CSS STYLES
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3), // fix this
        padding: theme.spacing(3)
    },
    deleteButton: {
        marginTop: theme.spacing(8),
        backgroundColor: theme.palette.error.dark,
    }
}))

export default function BookPage ({ book }) {

    // CSS CLASSES - FIX THIS!
    const classes = useStyles()

    // NEXT ROUTER SETUP
    const router = useRouter();

    // MANAGE STATE HERE
    const [ message, setMessage ] = useState('')

    // Deletes the Book!
    const handleDelete = async () => {

        const bookID = router.query.id

        try {
            await axios(`/api/books/${bookID}`, {
                method: 'DELETE',
            })
            router.push('/')
        } catch (error) {
            setMessage('Failed to delete this book')
        }
    }

    return (
            <Paper variant="outlined" className={classes.paper}>

                <Typography variant="h2">
                    {book.title}
                </Typography>

                <Typography variant="h5" color="primary">
                    {book.author}
                </Typography>

                <Typography variant="subtitle1">
                    Published: {book.year_published}
                </Typography>

                <Typography variant="body2">
                    Page count: {book.number_of_pages}
                </Typography>

                <Typography variant="body2">
                    Genre: {book.genre}
                </Typography>

                <Typography variant="body2">
                    Summary: {book.summary}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.deleteButton}
                    onClick={handleDelete}
                >
                    Delete
                </Button>

            </Paper>
    )
}

export async function getServerSideProps({ params }) {
    await dbConnect()

    const book = await Book.findById(params.id).lean()
    book._id = book._id.toString()

    return { props: { book }}
}