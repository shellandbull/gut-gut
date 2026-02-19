export const structureDataPrompt = `Extract the following fields as JSON from the provided text. Return only valid JSON, no explanation.

{
  "property": {
    "management_type": "WEG or MV",
    "name": "",
    "property_manager": "",
    "accountant": ""
  },
  "buildings": [
    {
      "street": "",
      "house_number": "",
      "details": ""
    }
  ],
  "units": [
    {
      "number": "",
      "type": "Apartment | Office | Garden | Parking",
      "building": "",
      "floor": "",
      "entrance": "",
      "size": "",
      "co_ownership_share": "",
      "construction_year": "",
      "rooms": ""
    }
  ]
}

If a field is not found, set it to null. If there are multiple buildings or units, return all of them.`;
