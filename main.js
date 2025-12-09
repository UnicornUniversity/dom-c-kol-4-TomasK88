/**
 * main: volá nejprve generateEmployeeData(dtoIn) a poté getEmployeeStatistics(employees)
 * Vrací dtoOut se statistikami.
 * @param {object} dtoIn - obsahuje count a age {min, max}
 * @returns {object} dtoOut - statistiky
 */
export function main(dtoIn) {
    const employees = generateEmployeeData(dtoIn);
    const dtoOut = getEmployeeStatistics(employees);
    return dtoOut;
}


/**
 * Generuje seznam zaměstnanců v požadované struktuře (gender, birthdate, name, surname, workload).
 * Vstupem je dtoIn s počtem osob (count) a věkovým intervalem (age.min, age.max).
 * Výstupem je pole objektů zaměstnanců.
 * @param {object} dtoIn - Vstupní data (počet a věkový interval)
 * @param {number} dtoIn.count - Počet zaměstnanců, které máme vygenerovat
 * @param {object} dtoIn.age - Objekt s minimálním a maximálním věkem
 * @param {number} dtoIn.age.min - Minimální věk (v letech, reálné číslo)
 * @param {number} dtoIn.age.max - Maximální věk (v letech, reálné číslo)
 * @returns {Array<object>} Pole zaměstnanců s požadovanými informacmi
 */
export function generateEmployeeData(dtoIn) {
    // pole českých jmen pro muže a pro ženy.
    const maleNames = ["Jan", "Petr", "Lukáš", "Tomáš", "Jiří", "Martin", "Karel", "Ondřej", "Václav", "Marek"];
    const femaleNames = ["Jana", "Petra", "Lucie", "Tereza", "Eva", "Marie", "Hana", "Alena", "Veronika", "Kateřina"];

    // Příjmení rozdělené na mužské a ženské
    //    U ženských příjmení vytvořeno samostatné pole, protože nefungovalo mechanicky přidat "-ová" k mužskému příjmení (např. Outrata -> Outrataová, Pokorný->Pokornýová apod. není správně).
    const maleSurnames = ["Novák", "Svoboda", "Dvořák", "Černý", "Procházka", "Kučera", "Outrata", "Pokorný", "Král", "Sedláček"];
    const femaleSurnames = ["Nováková", "Svobodová", "Dvořáková", "Černá", "Procházková", "Kučerová", "Outratová", "Pokorná", "Králová", "Sedláčková"];

    // Úvazky dle zadání: 10 / 20 / 30 / 40 hodin týdně.
    const workloads = [10, 20, 30, 40];

    // pole pro vygenerované zaměstnance.
    const employees = [];

    //validace vstupů    
    if (typeof dtoIn.count !== "number" || dtoIn.count <= 0) {  //podmínka, že počet zaměstanců které chceme generovat musí být číslo větší než 0 a že je to vůbec číslo
        console.error("Hodnota 'count' musí být kladné číslo.");
    }
    //podmínka pro věkový interval, validujeme jestli je zadáno číslo a jestli není minimální věk větší než maximální věk
    if (
        typeof dtoIn.age !== "object" ||
        typeof dtoIn.age.min !== "number" ||
        typeof dtoIn.age.max !== "number" ||
        dtoIn.age.min > dtoIn.age.max
    ) {
        console.error("Věkový interval je neplatný.");
    }


    // generování tolika zaměstnanců, kolik je v dtoIn.count.
    for (let i = 0; i < dtoIn.count; i++) {
        // Pohlaví určíme náhodně (pravděpodobnost 50:50).
        const gender = Math.random() < 0.5 ? "male" : "female";

        // Podle pohlaví vybereme křestní jméno z příslušného pole.
        const name =
            gender === "male"
                ? maleNames[randomInt(0, maleNames.length - 1)]
                : femaleNames[randomInt(0, femaleNames.length - 1)];

        // Podle pohlaví vybereme příjmení (mužské / ženské).
        const surname =
            gender === "male"
                ? maleSurnames[randomInt(0, maleSurnames.length - 1)]
                : femaleSurnames[randomInt(0, femaleSurnames.length - 1)];

        // Náhodně vybereme jeden z povolených úvazků (10 / 20 / 30 / 40).
        const workload = workloads[randomInt(0, workloads.length - 1)];

        // Vygenerujeme datum narození tak, aby věk byl v intervalu <min, max>.
        //    Používáme průměrnou délku roku (365.25 dne) 
        const birthdate = generateBirthdate(dtoIn.age.min, dtoIn.age.max);

        // sestavení objektu zaměstnance v požadované strkutře a přidání do pole.
        employees.push({ gender, birthdate, name, surname, workload });
    }

    // Vrátíme  pole zaměstnanců.
    return employees;
}

/**
 * Vrátí náhodné celé číslo
 * Použítí Math.floor nad Math.random(), aby bylo číslo celé.
 * @param {number} min - Dolní hranice (včetně)
 * @param {number} max - Horní hranice (včetně)
 * @returns {number} Náhodné celé číslo v intervalu
 */

/**
 * Vypočítá statistiky o zaměstnancích – počty úvazků, věkové statistiky,
 * průměrné hodnoty a seřazený seznam zaměstnanců.
 * @param {Array} employees - Pole zaměstnanců vytvořené funkcí generateEmployeeData.
 * @returns {object} Vrací objekt obsahující statistiky.
 */
export function getEmployeeStatistics(employees) {
    const dtoOut = {};

    // --- počty workloadů ---
    const workloadCounts = countWorkloads(employees);


    // --- výpočet věků (přesné, kontinuální) ---
    const msPerYear = 365.25 * 24 * 60 * 60 * 1000; // stejná konstanta jako při generování
    const preciseAges = employees.map(e =>
        (Date.now() - new Date(e.birthdate).getTime()) / msPerYear
    );
    // průměr věku – přesné věky, 1 desetinné místo
    const averageAge = preciseAges.length
        ? Number(average(preciseAges).toFixed(1))
        : 0;
    // min / max / median – zaokrouhleny na celá čísla (po výpočtu z přesných věků)
    const minAge = preciseAges.length ? Math.floor(Math.min(...preciseAges)) : 0;
    const maxAge = preciseAges.length ? Math.ceil(Math.max(...preciseAges)) : 0;
    const medianAge = preciseAges.length ? Math.round(median(preciseAges)) : 0;


    // medián workloadu – celé číslo
    const workloads = employees.map(e => e.workload);
    const medianWorkload = Math.round(median(workloads));

    // průměrný workload žen
    const averageWomenWorkload = calculateAverageWomenWorkload(employees);

    // seřazení výstupu
    const sortedByWorkload = sortByWorkload(employees);

    // --- sestavení výsledného dtoOut ---
    dtoOut.total = employees.length;
    dtoOut.workload10 = workloadCounts.workload10;
    dtoOut.workload20 = workloadCounts.workload20;
    dtoOut.workload30 = workloadCounts.workload30;
    dtoOut.workload40 = workloadCounts.workload40;

    dtoOut.averageAge = averageAge;
    dtoOut.minAge = minAge;
    dtoOut.maxAge = maxAge;
    dtoOut.medianAge = medianAge;

    dtoOut.medianWorkload = medianWorkload;
    dtoOut.averageWomenWorkload = averageWomenWorkload;
    dtoOut.sortedByWorkload = sortedByWorkload;

    return dtoOut;
}

/**
 * Vypočítá věk osoby v celých letech podle kalendářních dat.
 * Zohledňuje, zda již letos proběhly narozeniny.
 * @param {string} birthdate - ISO řetězec narození (např. "1988-04-12T10:23:00Z")
 * @returns {number} Věk v celých letech
 */
function calculateExactAge(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}
/**
 * Vypočítá věk pro každého zaměstnance v poli pomocí přesného kalendářního výpočtu.
 * @param {Array} employees - Pole zaměstnanců
 * @returns {Array<number>} Věky zaměstnanců
 */
function calculateAges(employees) {
    return employees.map(e => calculateExactAge(e.birthdate));
}

/**
 * Spočítá průměr čísel v poli.
 * @param {Array<number>} arr Pole čísel pro výpočet průměru.
 * @returns {number} Vrací průměr čísel, nebo 0 pokud je pole prázdné.
 */
function average(arr) {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((sum, value) => sum + value, 0);
    return sum / arr.length;
}

/**
 * Spočítá medián čísel v poli.
 * Pokud má pole sudý počet prvků, vrací průměr dvou prostředních hodnot.
 * @param {Array<number>} arr Pole čísel, pro která se má zjistit medián.
 * @returns {number} Vrací medián hodnot pole.
 */
function median(arr) {
    if (arr.length === 0) return 0;
    const sorted = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 1) {
        return sorted[mid];
    } else {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
}

/**
 * Spočítá počet zaměstnanců podle jejich pracovního úvazku (10/20/30/40).
 * @param {Array} employees - Pole zaměstnanců, kteří mají vlastnost workload.
 * @returns {{workload10:number, workload20:number, workload30:number, workload40:number}} Vrací objekt s počty pro jednotlivé typy úvazků.
 */
function countWorkloads(employees) {
    return {
        workload10: employees.filter(e => e.workload === 10).length,
        workload20: employees.filter(e => e.workload === 20).length,
        workload30: employees.filter(e => e.workload === 30).length,
        workload40: employees.filter(e => e.workload === 40).length
    };
}

/**
 * Spočítá průměrný úvazek zaměstnankyň, zaokrouhlený na jedno desetinné místo.
 * @param {Array} employees - Pole zaměstnanců, které může obsahovat ženy s různými úvazky.
 * @returns {number}  Vrací průměrný úvazek žen, nebo 0 pokud žádné nejsou.
 */
function calculateAverageWomenWorkload(employees) {
    const women = employees.filter(e => e.gender === "female");
    if (women.length === 0) return 0;

    const workloads = women.map(w => w.workload);
    const avg = average(workloads);

    return Number(avg.toFixed(1)); // povoleno: 1 desetinné místo
}

/**
 * Vrátí nové pole zaměstnanců seřazené vzestupně podle pracovního úvazku.
 * @param {Array} employees - Pole zaměstnanců s vlastností workload.
 * @returns {Array} Vrací nové pole seřazených zaměstnanců.
 */
function sortByWorkload(employees) {
    return employees.slice().sort((a, b) => a.workload - b.workload);
}
/**
 * Pomocná funkce pro generování náhodného čísla z intervalu
 * @param {*} min dolní interval čísla
 * @param {*} max horní interval čísla
 * @returns 
 */
function randomInt(min, max) {
    // Math.random() vrací číslo v intervalu <0, 1).
    // Násobením a posunem získáme požadovaný interval a Math.floor zaokrouhlí dolů.
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Vygeneruje náhodné datum narození tak, aby výsledný věk byl v intervalu <minAge, maxAge>.
 * Postup:
 *  - vezmu aktuální čas,
 *  - spočítám dvě hrany (nejmladší možný: "teď - minAge", nejstarší možný: "teď - maxAge"),
 *  - vybereu náhodný čas mezi těmito hranami.
 * @param {number} minAge - Minimální věk (v letech)
 * @param {number} maxAge - Maximální věk (v letech)
 * @returns {string} ISO datum narození (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
function generateBirthdate(minAge, maxAge) {
    // Aktuální datum/čas
    const now = new Date();

    // Počet milisekund v jednom „průměrném“ roku (365.25 dne), dny*hodiny*minuty*sekundy*1000
    const msPerYear = 365.25 * 24 * 60 * 60 * 1000;

    //  Nejmladší dovolené datum narození 
    const youngest = new Date(now.getTime() - minAge * msPerYear);

    // Nejstarší dovolené datum narození 
    const oldest = new Date(now.getTime() - maxAge * msPerYear);

    // Náhodný timestamp mezi „oldest“ a „youngest“
    const randomTime = randomInt(oldest.getTime(), youngest.getTime());

    // Převod na ISO formát
    return new Date(randomTime).toISOString();
}

/* Test funkčnosti
const dtoIn = { 
    count: 50, 
    age: { 
        min: 18, 
        max: 60 } 
    };

const result = main(dtoIn);
console.log(result);
*/


