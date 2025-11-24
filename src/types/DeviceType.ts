export type DeviceType =
	| 'Android'
	| 'iPhone'
	| 'Unknown Device'
	| 'Bot'
	| 'Command Line Client'
	| 'Smart TV'
	| 'Android Tablet'
	| 'Tablet'
	| 'Mobile Native App'
	| 'Android (Native)'
	| 'Blackberry'
	| 'Windows Phone'
	| 'Mobile'
	| 'Electron App'
	| 'Mac Desktop'
	| 'Windows Desktop'
	| 'Linux Desktop'
	| 'ChromeOS Desktop'
	| 'Raspberry Pi'
	| 'Desktop';

export type IPAddress = `${number}.${number}.${number}.${number}` | 'localhost';
