import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import { toast } from "react-toastify";

// for relocating to login-page when unlogged-in user will check out
export default function RequireAuth() {
    const {user} = useAppSelector(state => state.account);
    const location = useLocation();  // can relocate back to where it come from

    if (!user) {
        toast.error('You need to be logged in to do that!');
        return <Navigate to='/login' state={{ from: location }} />
    }

    return <Outlet />
}