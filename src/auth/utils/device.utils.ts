import type { DeviceType, IPAddress } from '@/types/DeviceType';
import type { Request } from 'express';
import { type AgentDetails } from 'express-useragent';

export const parseDeviceType = (
	device: AgentDetails | undefined
): DeviceType => {
	if (!device) return 'Unknown Device';

	if (device.isBot) return 'Bot';
	else if (device.isCurl) return 'Command Line Client';
	else if (device.isSmartTV) return 'Smart TV';
	else if (device.isAndroidTablet) return 'Android Tablet';
	else if (device.isTablet || device.isiPad) return 'Tablet';
	else if (device.isMobileNative) return 'Mobile Native App';
	else if (device.isiPhone || device.isiPhoneNative) return 'iPhone';
	else if (device.isAndroidNative) return 'Android (Native)';
	else if (device.isAndroid) return 'Android';
	else if (device.isBlackberry) return 'Blackberry';
	else if (device.isWindowsPhone) return 'Windows Phone';
	else if (device.isMobile) return 'Mobile';
	else if (device.isElectron) return 'Electron App';
	else if (device.isDesktop) {
		if (device.isMac) return 'Mac Desktop';
		else if (device.isWindows) return 'Windows Desktop';
		else if (device.isLinux || device.isLinux64) return 'Linux Desktop';
		else if (device.isChromeOS) return 'ChromeOS Desktop';
		else if (device.isRaspberry) return 'Raspberry Pi';
		return 'Desktop';
	}

	// Fallback
	return 'Unknown Device';
};

export const parseDeviceIP = (req: Request): IPAddress => {
	const { ip } = req;
	return ip === '::1' ? 'localhost' : (ip as IPAddress);
};
