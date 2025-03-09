import provinceData from '../json/provinces.json';
import regencyData from '../json/regencies.json';
import districtData from '../json/districts.json';
import villageData from '../json/villages.json';

export const getProvinceDetail = (id: string) =>
  (provinceData as any[])
    .find((data) => data?.province_id === id)
    .map((data: Record<string, string>) => ({
      value: data.province_id,
      label: data.province_name,
    }));
export const getRegencyDetail = (id: string) =>
  (regencyData as any[])
    .find((regency) => regency?.regency_id === id)
    .map((data: Record<string, string>) => ({
      value: data.regency_id,
      label: data.regency_name,
    }));
export const getDistrictDetail = (id: string) =>
  (districtData as any[])
    .find((district) => district?.district_id === id)
    .map((data: Record<string, string>) => ({
      value: data.district_id,
      label: data.district_name,
    }));
export const getVillageDetail = (id: string) =>
  (villageData as any[])
    .find((village) => village?.village_id === id)
    .map((data: Record<string, string>) => ({
      value: data.village_id,
      label: data.village_name,
    }));
