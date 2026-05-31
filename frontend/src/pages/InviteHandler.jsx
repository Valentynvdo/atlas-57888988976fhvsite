import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function InviteHandler() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      localStorage.setItem("atlas_invite_code", code);
    }
    // Redirect to login/register page
    navigate("/login?tab=register", { replace: true });
  }, [code, navigate]);

  return null;
}
