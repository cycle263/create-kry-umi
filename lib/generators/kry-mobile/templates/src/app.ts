<% if (reactFeatures.includes('pont')) { -%>
import '../pontAPI/';
<% } -%>

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
