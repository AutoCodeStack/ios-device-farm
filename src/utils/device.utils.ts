type DeviceMap = { [key: string]: string };

const iPhoneModels: DeviceMap = {
	"iPhone1,1": "iPhone (Original)",
	"iPhone1,2": "iPhone 3G",
	"iPhone2,1": "iPhone 3GS",
	"iPhone3,1": "iPhone 4",
	"iPhone3,2": "iPhone 4",
	"iPhone3,3": "iPhone 4",
	"iPhone4,1": "iPhone 4S",
	"iPhone5,1": "iPhone 5",
	"iPhone5,2": "iPhone 5",
	"iPhone5,3": "iPhone 5c",
	"iPhone5,4": "iPhone 5c",
	"iPhone6,1": "iPhone 5s",
	"iPhone6,2": "iPhone 5s",
	"iPhone7,2": "iPhone 6",
	"iPhone7,1": "iPhone 6 Plus",
	"iPhone8,1": "iPhone 6s",
	"iPhone8,2": "iPhone 6s Plus",
	"iPhone8,4": "iPhone SE (1st generation)",
	"iPhone9,1": "iPhone 7",
	"iPhone9,3": "iPhone 7",
	"iPhone9,2": "iPhone 7 Plus",
	"iPhone9,4": "iPhone 7 Plus",
	"iPhone10,1": "iPhone 8",
	"iPhone10,4": "iPhone 8",
	"iPhone10,2": "iPhone 8 Plus",
	"iPhone10,5": "iPhone 8 Plus",
	"iPhone10,3": "iPhone X",
	"iPhone10,6": "iPhone X",
	"iPhone11,8": "iPhone XR",
	"iPhone11,2": "iPhone XS",
	"iPhone11,4": "iPhone XS Max",
	"iPhone11,6": "iPhone XS Max",
	"iPhone12,1": "iPhone 11",
	"iPhone12,3": "iPhone 11 Pro",
	"iPhone12,5": "iPhone 11 Pro Max",
	"iPhone12,8": "iPhone SE (2nd generation)",
	"iPhone13,1": "iPhone 12 Mini",
	"iPhone13,2": "iPhone 12",
	"iPhone13,3": "iPhone 12 Pro",
	"iPhone13,4": "iPhone 12 Pro Max",
	"iPhone14,4": "iPhone 13 Mini",
	"iPhone14,5": "iPhone 13",
	"iPhone14,2": "iPhone 13 Pro",
	"iPhone14,3": "iPhone 13 Pro Max",
	"iPhone14,6": "iPhone SE (3rd generation)",
	"iPhone14,7": "iPhone 14",
	"iPhone14,8": "iPhone 14 Plus",
	"iPhone15,2": "iPhone 14 Pro",
	"iPhone15,3": "iPhone 14 Pro Max",
};

const iPadModels: DeviceMap = {
	"iPad1,1": "iPad (1st generation)",
	"iPad2,1": "iPad 2",
	"iPad2,2": "iPad 2",
	"iPad2,3": "iPad 2",
	"iPad2,4": "iPad 2",
	"iPad3,1": "iPad (3rd generation)",
	"iPad3,2": "iPad (3rd generation)",
	"iPad3,3": "iPad (3rd generation)",
	"iPad3,4": "iPad (4th generation)",
	"iPad3,5": "iPad (4th generation)",
	"iPad3,6": "iPad (4th generation)",
	"iPad4,1": "iPad Air",
	"iPad4,2": "iPad Air",
	"iPad4,3": "iPad Air",
	"iPad5,3": "iPad Air 2",
	"iPad5,4": "iPad Air 2",
	"iPad6,11": "iPad (5th generation)",
	"iPad6,12": "iPad (5th generation)",
	"iPad7,5": "iPad (6th generation)",
	"iPad7,6": "iPad (6th generation)",
	"iPad7,11": "iPad (7th generation)",
	"iPad7,12": "iPad (7th generation)",
	"iPad11,6": "iPad (8th generation)",
	"iPad11,7": "iPad (8th generation)",
	"iPad12,1": "iPad (9th generation)",
	"iPad12,2": "iPad (9th generation)",
	"iPad11,3": "iPad Air (3rd generation)",
	"iPad11,4": "iPad Air (3rd generation)",
	"iPad13,1": "iPad Air (4th generation)",
	"iPad13,2": "iPad Air (4th generation)",
	"iPad13,16": "iPad Air (5th generation)",
	"iPad13,17": "iPad Air (5th generation)",
	"iPad2,5": "iPad mini",
	"iPad2,6": "iPad mini",
	"iPad2,7": "iPad mini",
	"iPad4,4": "iPad mini 2",
	"iPad4,5": "iPad mini 2",
	"iPad4,6": "iPad mini 2",
	"iPad4,7": "iPad mini 3",
	"iPad4,8": "iPad mini 3",
	"iPad4,9": "iPad mini 3",
	"iPad5,1": "iPad mini 4",
	"iPad5,2": "iPad mini 4",
	"iPad11,1": "iPad mini (5th generation)",
	"iPad11,2": "iPad mini (5th generation)",
	"iPad14,1": "iPad mini (6th generation)",
	"iPad14,2": "iPad mini (6th generation)",
	"iPad6,3": "iPad Pro (9.7-inch)",
	"iPad6,4": "iPad Pro (9.7-inch)",
	"iPad7,3": "iPad Pro (10.5-inch)",
	"iPad7,4": "iPad Pro (10.5-inch)",
	"iPad8,1": "iPad Pro (11-inch) (1st generation)",
	"iPad8,2": "iPad Pro (11-inch) (1st generation)",
	"iPad8,3": "iPad Pro (11-inch) (1st generation)",
	"iPad8,4": "iPad Pro (11-inch) (1st generation)",
	"iPad8,9": "iPad Pro (11-inch) (2nd generation)",
	"iPad8,10": "iPad Pro (11-inch) (2nd generation)",
	"iPad13,4": "iPad Pro (11-inch) (3rd generation)",
	"iPad13,5": "iPad Pro (11-inch) (3rd generation)",
	"iPad13,6": "iPad Pro (11-inch) (3rd generation)",
	"iPad13,7": "iPad Pro (11-inch) (3rd generation)",
	"iPad14,3": "iPad Pro (11-inch) (4th generation)",
	"iPad14,4": "iPad Pro (11-inch) (4th generation)",
	"iPad6,7": "iPad Pro (12.9-inch) (1st generation)",
	"iPad6,8": "iPad Pro (12.9-inch) (1st generation)",
	"iPad7,1": "iPad Pro (12.9-inch) (2nd generation)",
	"iPad7,2": "iPad Pro (12.9-inch) (2nd generation)",
	"iPad8,5": "iPad Pro (12.9-inch) (3rd generation)",
	"iPad8,6": "iPad Pro (12.9-inch) (3rd generation)",
	"iPad8,7": "iPad Pro (12.9-inch) (3rd generation)",
	"iPad8,8": "iPad Pro (12.9-inch) (3rd generation)",
	"iPad8,11": "iPad Pro (12.9-inch) (4th generation)",
	"iPad8,12": "iPad Pro (12.9-inch) (4th generation)",
	"iPad13,8": "iPad Pro (12.9-inch) (5th generation)",
	"iPad13,9": "iPad Pro (12.9-inch) (5th generation)",
	"iPad13,10": "iPad Pro (12.9-inch) (5th generation)",
	"iPad13,11": "iPad Pro (12.9-inch) (5th generation)",
	"iPad14,5": "iPad Pro (12.9-inch) (6th generation)",
	"iPad14,6": "iPad Pro (12.9-inch) (6th generation)",
};

export const getDeviceSize = (machineId: string) => {
	return iPhoneDevicesSizes[machineId] || { dpr: 3, viewportWidth: 430, viewportHeight: 932 };
};

const iPhoneDevicesSizes: { [key: string]: any } = {
	"iPhone8,4": { dpr: 2, viewportWidth: 320, viewportHeight: 568 }, // iPhone SE (1st Gen)
	"iPhone12,8": { dpr: 2, viewportWidth: 375, viewportHeight: 667 }, // iPhone SE (2nd Gen)
	"iPhone7,2": { dpr: 2, viewportWidth: 375, viewportHeight: 667 }, // iPhone 6
	"iPhone8,1": { dpr: 2, viewportWidth: 375, viewportHeight: 667 }, // iPhone 6s
	"iPhone9,3": { dpr: 2, viewportWidth: 375, viewportHeight: 667 }, // iPhone 7
	"iPhone10,1": { dpr: 2, viewportWidth: 375, viewportHeight: 667 }, // iPhone 8
	"iPhone7,1": { dpr: 3, viewportWidth: 414, viewportHeight: 736 }, // iPhone 6 Plus
	"iPhone8,2": { dpr: 3, viewportWidth: 414, viewportHeight: 736 }, // iPhone 6s Plus
	"iPhone9,4": { dpr: 3, viewportWidth: 414, viewportHeight: 736 }, // iPhone 7 Plus
	"iPhone10,2": { dpr: 3, viewportWidth: 414, viewportHeight: 736 }, // iPhone 8 Plus
	"iPhone10,3": { dpr: 3, viewportWidth: 375, viewportHeight: 812 }, // iPhone X
	"iPhone11,2": { dpr: 3, viewportWidth: 375, viewportHeight: 812 }, // iPhone XS
	"iPhone11,4": { dpr: 3, viewportWidth: 414, viewportHeight: 896 }, // iPhone XS Max
	"iPhone11,8": { dpr: 2, viewportWidth: 414, viewportHeight: 896 }, // iPhone XR
	"iPhone12,1": { dpr: 2, viewportWidth: 414, viewportHeight: 896 }, // iPhone 11
	"iPhone12,3": { dpr: 3, viewportWidth: 375, viewportHeight: 812 }, // iPhone 11 Pro
	"iPhone12,5": { dpr: 3, viewportWidth: 414, viewportHeight: 896 }, // iPhone 11 Pro Max
	"iPhone13,1": { dpr: 3, viewportWidth: 360, viewportHeight: 780 }, // iPhone 12 Mini
	"iPhone13,2": { dpr: 3, viewportWidth: 390, viewportHeight: 844 }, // iPhone 12
	"iPhone13,3": { dpr: 3, viewportWidth: 390, viewportHeight: 844 }, // iPhone 12 Pro
	"iPhone13,4": { dpr: 3, viewportWidth: 428, viewportHeight: 926 }, // iPhone 12 Pro Max
	"iPhone14,4": { dpr: 3, viewportWidth: 360, viewportHeight: 780 }, // iPhone 13 Mini
	"iPhone14,5": { dpr: 3, viewportWidth: 390, viewportHeight: 844 }, // iPhone 13
	"iPhone14,2": { dpr: 3, viewportWidth: 393, viewportHeight: 852 }, // iPhone 14 Pro
	"iPhone14,3": { dpr: 3, viewportWidth: 430, viewportHeight: 932 }, // iPhone 14 Pro Max
	"iPhone15,2": { dpr: 3, viewportWidth: 393, viewportHeight: 852 }, // iPhone 15 Pro
	"iPhone15,3": { dpr: 3, viewportWidth: 430, viewportHeight: 932 }, // iPhone 15 Pro Max
};

export function getDeviceName(machineId: string): string | undefined {
	return iPhoneModels[machineId] || iPadModels[machineId] || undefined;
}
