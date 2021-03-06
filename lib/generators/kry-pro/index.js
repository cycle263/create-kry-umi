const debug = require('debug')('create-umi:generator');
const BasicGenerator = require('../../BasicGenerator');

class Generator extends BasicGenerator {
  prompting() {
    if (this.opts.args && 'isTypeScript' in this.opts.args && 'reactFeatures' in this.opts.args) {
      this.prompts = {
        isTypeScript: this.opts.args.isTypeScript,
        reactFeatures: this.opts.args.reactFeatures,
      };
    } else {
      const prompts = [
        {
          name: 'isTypeScript',
          type: 'confirm',
          message: 'Do you want to use typescript?',
          default: false,
        },
        {
          name: 'useCnzz',
          type: 'confirm',
          message: 'Do you want to use cnzz?',
          default: false,
        },
        {
          name: 'reactFeatures',
          message: 'What functionality do you want to enable?',
          type: 'checkbox',
          choices: [
            {name: 'antd', value: 'antd'},
            {name: 'dva', value: 'dva'},
            {name: 'code splitting', value: 'dynamicImport'},
            {name: 'dll', value: 'dll'},
            {name: 'internationalization', value: 'locale'},
            {name: 'pont', value: 'pont'},
          ],
          default: ['antd', 'dva', 'dynamicImport', 'dll', 'locale', 'pont'],
        },
      ];
      return this.prompt(prompts).then(props => {
        this.prompts = props;
      });
    }
  }

  writing() {
    this.writeFiles({
      context: {
        name: this.name,
        ...this.prompts,
      },
      filterFiles: f => {
        const { isTypeScript, reactFeatures } = this.prompts;
        if (!reactFeatures.includes('pont')) {
          if (f.startsWith('pont-config.json') || f === 'pontTemplate.js' || f === 'serviceTemplate.js' || f === 'pontTemplate.ts' || f === 'serviceTemplate.ts') return false;
        }
        if (isTypeScript) {
          if (this.isJsFile(f)) return false;
          if (!reactFeatures.includes('dva')) {
            if (f.startsWith('src/models') || f === 'src/app.ts') return false;
          }
          if (!reactFeatures.includes('locale')) {
            if (f.startsWith('src/locales') || f.includes('umi-plugin-locale')) return false;
          }
          if (reactFeatures.includes('pont')) {
            if (f === 'pontTemplate.js' || f === 'serviceTemplate.js') return false;
          }
        } else {
          if (this.isTsFile(f)) return false;
          if (!reactFeatures.includes('dva')) {
            if (f.startsWith('src/models') || f === 'src/app.js') return false;
          }
          if (!reactFeatures.includes('locale')) {
            if (f.startsWith('src/locales') || f.includes('umi-plugin-locale')) return false;
          }
          if (reactFeatures.includes('pont')) {
            if (f === 'pontTemplate.ts' || f === 'serviceTemplate.ts') return false;
          }
        }
        return true;
      },
    });
  }
}

module.exports = Generator;
