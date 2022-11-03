{
	"Typescript json key loop": {
		"prefix": "key",
		"body": [
			"const keys = Object.keys($1);",
			"keys.forEach(key => {",
			"\tconsole.warn(`key - ${test[key]}`);",
			"});",
		]
	},
	"Ionic popover": {
		"prefix": "pop",
		"body": [
			"const popover = await this.popoverCtrl.create({",
				"\tcomponent: $1,",
				"\tevent: ev,",
				"\t// cssClass: 'custom-popover'",
			"});",
			"popover.onDidDismiss()",
			".then((res) => {",
			"});",
			"await popover.present();"
		]
	},
	"Ionic toast": {
		"prefix": "toast",
		"body": [
			"async presentToast(message = 'Alert', duration = 2000) {",
				"\tconst toast = await this.toastCtrl.create({",
					"\t\tmessage,",
					"\t\tduration",
				"\t});",
				"\ttoast.present();",
			"}",
		]
	},
	"Ionic loading": {
		"prefix": "loading",
		"body": [
			"private loading;",

			"async presentLoading(message = 'loading data...') {",
					"\tthis.loading = await this.loadingCtrl",
					"\t.create({",
					"\t\t//cssClass: '',",
					"\t\tmessage",
					"\t});",

				"\treturn await this.loading.present();",
			"}",

			"dismissLoading() {",
				"\tif (this.loading) { this.loading.dismiss(); }",
			"}",
		]
	},
	"ApiMessage class": {
		"prefix": "ApiMessage",
		"body": [
			"export abstract class ApiMessage {",
				"\tpublic fromHub = false;",
				"\tpublic constructor() {}",
			"",
				"\tloadFromJson(json: object): this {",
					"\t\tObject.keys(json).forEach(key => {",
						"\t\t\tif (this.hasOwnProperty(key)) {",
							"\t\t\t\tthis[key] = json[key];",
						"\t\t\t}",
					"\t\t});",
					"\t\treturn this;",
				"\t}",
				"\tmapForServer(): object {",
					"\t\treturn this as object;",
				"\t}",
			"}",
			"",
			"export function createApiMessageInstance<T extends ApiMessage>(c): T {",
				"\treturn new c();",
			"}",
  
		]
	},
	"Alert Confirmation": {
		"prefix": "alert",
		"body": [
			"const alert = await this.alertCtrl.create({",
				"\theader: 'Confirmation',",
				"\tmessage: 'Êtes-vous certain de vouloir annuler vos modifications ?',",
				"\tbuttons: [",
					"\t\t{",
					"\t\t\ttext: 'Annuler',",
					"\t\t\trole: 'cancel',",
					"\t\t\tcssClass: 'secondary',",
					"\t\t\thandler: (blah) => {",
					"\t\t\t}",
					"\t\t}, {",
					"\t\t\ttext: 'Okay',",
					"\t\t\thandler: () => {",
					"\t\t\t}",
					"\t\t}",
				"\t\t]",
				"\t});",
			"await alert.present();",
		]
	},
	"ApiMessage loadFromJson": {
		"prefix": "loadFromJson",
		"body": [
			"public loadFromJson(json: Object): this {",
				"\tthis.id = json['id'];",
			"}"
		]
	},
	"fetch data array with helper": {
		"prefix": "fetchArray",
		"body": [
			"fetchData(): Observable<$1[]> {",
				"\treturn this.http.get(`${$2}`)",
				"\t.pipe(",
					"\t\tmap((jsonArray: Object[]) =>",
					"\t\t\tjsonArray.map((jsonItem) =>",
					"\t\t\t\tcreateApiMessageInstance(Card).loadFromJson(jsonItem)",
					"\t\t\t)",
					"\t\t)",
				"\t);",
			"}",
		]
	},
	"fetch single data with helper": {
		"prefix": "fetchSingle",
		"body": [
			"fetchDetail(): Observable<$1> {",
			"\treturn this.http.get(`${$2}`)",
			"\t.pipe(map((jsonItem) => createApiMessageInstance($1).loadFromJson(jsonItem)));",
			"}",
		]
	},
	"ngFor loop trackBy Function": {
		"prefix": "track",
		"body": [
			"trackFn(index, user) {",
			"\treturn user.id;",
			"}"
		]
	}
}
