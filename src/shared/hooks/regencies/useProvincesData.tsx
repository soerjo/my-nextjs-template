import provinceData from '@/shared/lib/json/provinces.json';
import regencyData from '@/shared/lib/json/regencies.json';
import districtData from '@/shared/lib/json/districts.json';
import villageData from '@/shared/lib/json/villages.json';

const useProvincesData = () => {
  const getListProvinces = () => {
    return provinceData.map((province) => ({
    value: province.province_id,
    label: province.province_name,
  }));
}

  const getListRegencies = (provinceId: string) => {
    return (regencyData as any[])
      .filter((regency: Record<string, string>) => regency.province_id === provinceId)
      .map((regency: Record<string, string>) => ({
        value: regency.regency_id,
        label: regency.regency_name,
      }));
  };

  const getListDistricts = (regencyId: string) => {
    return (districtData as any[])
      .filter((district: Record<string, string>) => district.regency_id === regencyId)
      .map((district: Record<string, string>) => ({
        value: district.district_id,
        label: district.district_name,
      }));
  };

  const getListVillages = (districtId: string) => {
    return (villageData as any[])
      .filter((village: Record<string, string>) => village.district_id === districtId)
      .map((village: Record<string, string>) => ({
        value: village.village_id,
        label: village.village_name,
      }));
  };

  return { getListProvinces, getListRegencies, getListDistricts, getListVillages };
};

export default useProvincesData;
