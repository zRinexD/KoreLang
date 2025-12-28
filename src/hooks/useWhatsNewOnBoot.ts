import { useEffect } from "react";
import { UIContextValue } from "../ui/UIContext";

export function useWhatsNewOnBoot(ui: UIContextValue) {
  useEffect(() => {
    const key = "whats_new_v1.1_seen";

    if (!sessionStorage.getItem(key)) {
      ui.open("whatsNew");
    }
  }, [ui]);
}
