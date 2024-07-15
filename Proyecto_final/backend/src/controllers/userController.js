import { User } from "../models/user.js";


// Obtener el perfil del usuario
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// Actualizar el perfil del usuario contratista
// Actualizar el perfil del usuario contratista
export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;

        // Asegúrate de que user.profile esté definido
        if (!user.profile) {
            user.profile = {}; // Inicializa profile si es undefined
        }

        user.profile.phone = req.body.phone || user.profile.phone;
        user.profile.company = req.body.company || user.profile.company;
        user.profile.nationality = req.body.nationality || user.profile.nationality;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            profile: updatedUser.profile,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};


// Actualizar el perfil del usuario talento
export const updateUserProfileTalent = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.username = req.body.username || user.username;
        user.profile.phone = req.body.phone || user.profile.phone;
        user.profile.nationality = req.body.nationality || user.profile.nationality;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
