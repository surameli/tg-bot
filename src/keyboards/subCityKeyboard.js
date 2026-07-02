import { Markup } from "telegraf";

export function getSubCityKeyboard(city) {

    const subCities = {

        "Addis Ababa": [
            ["Bole", "Yeka"],
            ["Arada", "Lideta"],
            ["Kolfe", "Kirkos"],
            ["Akaky Kaliti", "Nifas Silk"]
        ],

        "Adama": [
            ["01", "02"],
            ["03", "04"]
        ],

        "Hawassa": [
            ["Tabor", "Menaharia"]
        ],

        "Bahir Dar": [
            ["Belay Zeleke", "Shum Abo"]
        ],

        "Dire Dawa": [
            ["Kezira", "Sabian"]
        ],

        "Mekelle": [
            ["Hadnet", "Ayder"]
        ]

    };

    return Markup.keyboard(
        subCities[city] || [["Other"]]
    )
    .resize()
    .oneTime();

}