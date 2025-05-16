const notFound = (req,res) => {
    res.status(400).json({error: 'Route not found'})
}

export default notFound;