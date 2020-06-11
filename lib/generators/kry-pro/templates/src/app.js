<% if (reactFeatures.includes('pont')) { -%>
import '../pontAPI/';
<% } -%>

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
