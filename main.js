/**
 * Generuje seznam zaměstnanců v požadované struktuře (gender, birthdate, name, surname, workload).
 * Vstupem je dtoIn s počtem osob (count) a věkovým intervalem (age.min, age.max).
 * Výstupem je pole objektů zaměstnanců.
 *
 * Příklad vstupu:
 *   { count: 5, age: { min: 18, max: 60 } }
 *
 * Příklad výstupu (1 záznam):
 *   { gender: "male", birthdate: "1993-08-07T00:00:00.000Z", name: "Jan", surname: "Novák", workload: 40 }
 *
 * Poznámka: Datum narození generujeme tak, aby skutečný věk byl v intervalu <min, max> včetně.
 *           Používáme průměrný rok 365.25 dne, což stačí vzhledem k toleranci testů.
 */

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
 * Vypočítá požadované statistiky podle zadání.
 * - ages: počítá se jako desetinné roky (pracujeme s desetinným věkem)
 * - averageAge -> zaokrouhleno na 1 desetinné místo
 * - minAge, maxAge, medianAge -> zaokrouhleno na celá čísla (Math.round)
 * - medianWorkload -> celé číslo (zaručeno; výpočet mediánu a Math.round pro jistotu)
 * - averageWomenWorkload -> zaokrouhlení na 1 desetinné místo (nebo celé číslo) - povoleno
 * @param {Array} employees - pole objektů {gender, birthdate (ISO), name, surname, workload}
 * @returns {object} dtoOut s požadovanými poli
 */
export function getEmployeeStatistics(employees) {
    const dtoOut = {};

    // --- počty workloadů ---
    const workloadCounts = countWorkloads(employees);

    // --- výpočet věků ---
    const ages = calculateAges(employees);

    // průměr věku – 1 desetinné místo
    const averageAge = Number(average(ages).toFixed(1));

    // min / max / median věku – zaokrouhleno na celá čísla
    const minAge = Math.round(Math.min(...ages));
    const maxAge = Math.round(Math.max(...ages));
    const medianAge = Math.round(median(ages));

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
 * Vypočítá věk přesně podle kalendáře 
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
 * Vytvoří pole věků pomocí calculateExactAge().
 * @param {Array} employees - Pole zaměstnanců
 * @returns {Array<number>} Věky zaměstnanců
 */
function calculateAges(employees) {
    return employees.map(e => calculateExactAge(e.birthdate));
}

/**
 * Spočítá průměr čísel v poli.
 * @param {Array<number>} arr
 * @returns {number}
 */
function average(arr) {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((sum, value) => sum + value, 0);
    return sum / arr.length;
}

/**
 * Spočítá medián pole čísel.
 * @param {Array<number>} arr
 * @returns {number}
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
 * Vrátí počty zaměstnanců podle workloadů.
 * @param {Array} employees
 * @returns {{workload10:number, workload20:number, workload30:number, workload40:number}}
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
 * Spočítá průměrný workload žen, zaokrouhlený na 1 desetinné místo.
 * @param {Array} employees
 * @returns {number}
 */
function calculateAverageWomenWorkload(employees) {
    const women = employees.filter(e => e.gender === "female");
    if (women.length === 0) return 0;

    const workloads = women.map(w => w.workload);
    const avg = average(workloads);

    return Number(avg.toFixed(1)); // povoleno: 1 desetinné místo
}

/**
 * Vrátí zaměstnance seřazené podle úvazku (vzestupně).
 * @param {Array} employees
 * @returns {Array}
 */
function sortByWorkload(employees) {
    return employees.slice().sort((a, b) => a.workload - b.workload);
}

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


