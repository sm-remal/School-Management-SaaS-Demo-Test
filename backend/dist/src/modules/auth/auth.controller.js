import { authService } from "./auth.service";
import { validateLoginInput } from "./auth.validation";
const login = async (req, res) => {
    const payload = req.body;
    const validation = validateLoginInput(payload);
    if (!validation.success) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validation.errors,
        });
        return;
    }
    try {
        const result = await authService.login(payload);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (_error) {
        res.status(501).json({
            success: false,
            message: "Auth login is not implemented yet",
        });
    }
};
export const authController = {
    login,
};
//# sourceMappingURL=auth.controller.js.map