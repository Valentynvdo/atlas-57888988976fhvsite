import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function useLocalizedNavigate() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  return (path, options) => {
    if (typeof path !== "string" || !path.startsWith("/")) {
      return navigate(path, options);
    }
    const prefix = i18n.language === 'en' ? '/en' : '';
    const cleanPath = path.replace(/^\/en/, '') || '/';
    const localizedPath = `${prefix}${cleanPath === '/' ? '' : cleanPath}` || '/';
    return navigate(localizedPath, options);
  };
}
