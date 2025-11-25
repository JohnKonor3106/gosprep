import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

export const changeNavigate = ( path ) => navigate(path)