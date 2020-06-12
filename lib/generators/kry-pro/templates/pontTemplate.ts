import { Interface, BaseClass, Property, CodeGenerator } from 'pont-engine';

export default class MyGenerator extends CodeGenerator {
  getInterfaceContentInDeclaration(inter: Interface) {
    const requestParams = inter.getRequestParams();
    const paramsCode = inter.getParamsCode('Params');

    return `
      export ${paramsCode}

      export type Response = ${inter.responseType}

      export const init: Response;

      export function request(${requestParams}): Promise<Response>;
    `;
  }

  getBaseClassInDeclaration(base: BaseClass) {
    const originProps = base.properties;

    base.properties = base.properties.map(prop => {
      return new Property({
        ...prop,
        required: false
      });
    });

    const result = super.getBaseClassInDeclaration(base);
    base.properties = originProps;

    return result;
  }

  getInterfaceContent(inter: Interface) {
    const method = inter.method.toUpperCase();
    const paramsCode = inter.getParamsCode('Params', this.surrounding);
    const path = inter.path;

    return `
    /**
     * @desc ${inter.description}
     */

    import fetchRequest from "@/utils/request";
    import * as defs from '../../baseClass';

    export ${paramsCode}

    const pathReg = /({[a-zA-Z]*})/img;

    export const init = ${inter.response.getInitialValue()};

    const transPathParams = (str: string, params: any) => {
      return str.replace(pathReg, (result: any) => {
        const temp = result.replace(/[{}]/g, '');
        return params[temp] || result;
      });
    };

    const method = "${method.toLowerCase()}";
    export const request = (params: any = {}, option: any = {}) => {
      return fetchRequest[method](transPathParams("${path}", params), params, { ...option, mock: true, isPontAPI: true });
    }
   `;
  }
}
