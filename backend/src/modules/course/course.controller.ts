export const getAllCourses = (_, res) => {
    return res.status(200).json({
        success: true,
        message: "success"
    })
}