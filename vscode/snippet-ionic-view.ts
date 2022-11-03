{
	"Angular lazy loading component": {
		"prefix": "loadCompo",
		"body": [
			"loadComponent: () => import('./components/user/user.component').then(m => m.UserComponent)"
		]
	},
	"Ionic card": {
		"prefix": "ion-card",
		"body": [
			"<ion-card>",
				"\t<ion-card-header>",
					"\t\t<ion-card-subtitle>{{ i.subtitle }}</ion-card-subtitle>",
        			"\t\t<ion-card-title>{{ i.title }}</ion-card-title>",
				"\t</ion-card-header>",
				"\t\t{{ i.content }}",
				"\t<ion-card-content>",
				"\t</ion-card-content>",
			"</ion-card>"
		]
	},
	"Ionic list": {
		"prefix": "ion-list",
		"body": [
			"<ion-list>",
				"\t<ion-item lines=\"none\" *ngFor=\"let i of $1; trackBy: trackFn\">",
				"\t</ion-item>",
			"</ion-list>"
		]
	},
	"Ionic Refresher": {
		"prefix": "ion-refresher",
		"body": [
			"<ion-refresher slot=\"fixed\" (ionRefresh)=\"refreshData($event)\">",
				"\t<ion-refresher-content></ion-refresher-content>",
			"</ion-refresher>"
		]
	},
	"Ionic Buttons": {
		"prefix": "ion-buttons",
		"body": [
			"<ion-buttons slot=\"$1\">",
				"\t<ion-button (click)=\"action()\">",
				"\t\t<ion-icon slot=\"icon-only\" name=\"$2\"></ion-icon>",
				"\t</ion-button>",
			"</ion-buttons>"
		]
	},
	"Ionic Fab Buttons": {
		"prefix": "ion-fab",
		"body": [
			"<ion-fab vertical=\"bottom\" horizontal=\"end\" slot=\"fixed\">",
				"\t<ion-fab-button (click)=\"action()\">",
				"\t\t<ion-icon name=\"$2\"></ion-icon>",
				"\t</ion-fab-button>",
			"</ion-fab>"
		]
	},
	"Ionic Back button": {
		"prefix": "ion-back-buttons",
		"body": [
			"<ion-buttons slot=\"start\">",
			"\t<ion-back-button defaultHref=\"/\"></ion-back-button>",
			"</ion-buttons>"
		]
	},
	"Ionic standard button": {
		"prefix": "ion-button",
		"body": [
			"<ion-button (click)=\"$1\"></ion-button>"
		]
	},
	"Ionic Swiper": {
		"prefix": "swiper",
		"body": ["<swiper #swiper [config]=\"swiperConfig\"",
			"\t(slideChange)=\"swiperSlideChange($event)\">",
			"<ng-template swiperSlide *ngFor=\"let s of [].constructor(3); trackBy: trackFn; let i = index\">Slide {{ i }}",
			"</ng-template>",
		  "</swiper>"
		]
	},
	"ngFor loop": {
		"prefix": "ngFor",
		"body": "*ngFor=\"let $1 of $2; trackBy: trackFn | async\""
	},	
	"ngFor loop trackBy Function": {
		"prefix": "trackBy",
		"body": [
			"trackBy: trackFn"
		]
	},
	"ion-icon": {
		"prefix": "ion-icon",
		"body": "<ion-icon name=\"$1\"></ion-icon>"
	}
}
