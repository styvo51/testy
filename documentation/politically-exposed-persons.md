# IMX POLITICALLY EXPOSED PERSONS

### Status codes

| Status Codes | Meaning                                                    |
| :----------- | :--------------------------------------------------------- |
| 200          | Success                                                    |
| 400          | Bad request. E.g. If required properties were not provided |
| 403          | The request did not provide a valid api key                |
| 500          | Server error                                               |

## `POST` /politically-exposed-persons

Checks whether a person is recorded as an officially sanctioned individual and person of special interest on a third party dataset.

Query params:

```typescript
key: string; // API_KEY
```

Possible status codes:

- 200
- 400
- 403
- 500

### Example

Request:

- **url** : `"https://imx.tpa.company/politically-exposed-persons?key=apikey"`
- **method** : `POST`
- **content-type**: `application/json`
- **body**:

```json
{
  "reportingReference": "",
  "firstName": "Nur",
  "lastName": "Misuari",
  "gender": "Male",
  "dateOfBirth": "1939-03-03"
}
```

Response:

- **status**: `200`
- **content**:

Example response:

```json


{
    "reportingReference": "DZ-KWC-000000001038672",
    "safeHarbour": false,
    "watchlistAML": [
        {
            "status": 0,
            "verified": true,
            "safeHarbourScore": "None",
            "firstName": "Nur",
            "middleName": "",
            "lastName": "MISUARI",
            "dateOfBirth": "1939-03-03",
            "address1": "PHILIPPINES",
            "watchlistAMLAdditionalInfo": {
                "category": "TER/SIP",
                "scanId": "519303",
                "urlMore": "https://resttest.datazoo.com/watchlist/519303_20190722150111.pdf",
                "urlRemote": "URL for search history will appear here (authenticated users only)",
                "residentOf": "",
                "gender": "Male",
                "deathIndex": "NO",
                "placeOfBirth": "Philippines",
                "lastReviewed": "2018-12-04",
                "originalScriptName": [],
                "otherNames": [
                    "Nour MISUARI"
                ],
                "sanctionsReferences": [
                    "PEP Tier 1",
                    "Rep. Risk: Bribery and Corruption - Corrupt Practices",
                    "Rep. Risk: Terrorism - Violent Crimes with Terrorist Connection",
                    "Rep. Risk: Terrorism - Terrorist Financing and Support"
                ],
                "importantDates": [
                    "Date of Birth: 03 Mar 1939"
                ],
                "officialLists": [
                    "PHILIPPINES OFFICE OF THE OMBUDSMAN"
                ],
                "associates": [
					"Hassan Ali Basari",
					"Abdul Ghani Omar",
					"Salim Y Salamuddin Julkipli"
                ],
                "images": [
                    "https://secure.datazoo.com/images/0013775000/0013774074.jpg"
                ],
                "idNumbers": [
                    ""
                ],
                "notes": "[BIOGRAPHY] Political Positions - Former Governor of the Autonomous Region in Muslim Mindanao"
                		 "[REPORTS] A consultant of the National Democratic Front (NDF) on Saturday welcomed the suspension of the arrest warrant against Moro National Liberation Front (MNLF) leader Nur Misuari, saying it allows the Moro leader to take part in talks to end the Moro rebellion peacefully. ” Mapano, among several NDF leaders freed from jail in August to take part in peace talks with the government, said Misuari’s inputs and insights will have an impact on the peace process with the Bangsamoro. Despite factionalism in the MNLF, President Duterte had said Misuari still enjoyed the respect of the Moro people. In a resolution granting Misuari a six-month reprieve from arrest, Judge Maria Rowena Modesto-San Pedro, of the Regional Trial Court Branch 158 in Pasig City, noted that Misuari’s authority to represent his group has been consistently recognized by both the Philippine government and the Organization of Islamic Cooperation. ” by the Duterte administration to suspend the arrest of Misuari. FULL DISCLAIMER move” by the Duterte administration to suspend the arrest of Misuari. ” Misuari had been charged with leading an assault by the MNLF on Zamboanga City that led to the deaths of hundreds and the displacement of thousands of people.\r\n\r\nMoreover a key function on the scenario of the rebel groups - which besides are “all connected” - could be played by Nur Misuari, former MNLF leader, later integrated in the civil administration of the autonomous Region of Mindanao, and then arrested on charges of corruption and terrorism.\r\n\r\nSource: Fides, 15.02.2005\r\n\r\nThe source provides political exposure details of the subject. Please refer to the Political Positions and Linked Persons sections of the profile. http://www.fides.org/en/news/4059-ASIA_PHILIPPINES_Islamic_separatists_organise_bomb_blasts_in_various_parts_of_the_country_Dialogue_must_be_resumed_violence_can_only_bring_death_a_missionary_tells_Fides"
            }
        }
    ]
}


}
```

---
