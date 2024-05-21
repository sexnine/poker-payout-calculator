import type { ServerLoad } from "@sveltejs/kit";
import { deserialize } from "$lib/share";

export const load: ServerLoad = async ({ params }) => {
  if (params.rest?.length) {
    try {
      const data = deserialize(params.rest);

      return {
        data,
      };
    } catch (e) {
      console.error(e);
    }
  }

  return {};
};
