/**
 * Vygeneruje náhodná data zaměstnanců dle vstupního objektu.
 * @param {object} dtoIn Vstupní DTO
 * @param {number} dtoIn.count Počet zaměstnanců
 * @param {object} dtoIn.age Rozsah věků
 * @param {number} dtoIn.age.min Minimální věk
 * @param {number} dtoIn.age.max Maximální věk
 * @returns {Array<object>} Pole objektů zaměstnanců obsahující:
 *   gender {string}, name {string}, surname {string}, workload {number}, birthdate {string ISO}
 */
export function generateEmployeeData(dtoIn) {
    const maleNames = ["Jan", "Petr", "Lukáš", "Tomáš", "Jiří", "Martin", "Karel", "Ondřej", "Václav", "Marek"];
    const femaleNames = ["Jana", "Petra", "Lucie", "Tereza", "Eva", "Marie", "Hana", "Alena", "Veronika", "Kateřina"];
    const maleSurnames = ["Novák", "Svoboda", "Dvořák", "Černý", "Procházka", "Kučera", "Outrata", "Pokorný", "Král", "Sedláček"];
    const femaleSurnames = ["Nováková", "Svobodová", "Dvořáková", "Černá", "Procházková", "Kučerová", "Outratová", "Pokorná", "Králová", "Sedláčková"];
    const workloads = [10, 20, 30, 40];

    const result = [];

    for (let i = 0; i < dtoIn.count; i++) {
        const gender = Math.random() < 0.5 ? "male" : "female";

        const name = gender === "male"
            ? maleNames[randomInt(0, maleNames.length - 1)]
            : femaleNames[randomInt(0, femaleNames.length - 1)];

        const surname = gender === "male"
            ? maleSurnames[randomInt(0, maleSurnames.length - 1)]
            : femaleSurnames[randomInt(0, femaleSurnames.length - 1)];

        const workload = workloads[randomInt(0, workloads.length - 1)];

        result.push({
            gender,
            name,
            surname,
            workload,
            birthdate: generateBirthdate(dtoIn.age.min, dtoIn.age.max)
        });
    }

    return result;
}

/**
 * Vrátí statistiky
 * @param {Array<object>} employees Generovaní zaměstnanci
 * @returns {object} Obsahuje statistiky:
 *   total, workload10, workload20, workload30, workload40,
 *   averageAge, minAge, maxAge, medianAge,
 *   medianWorkload, averageWomenWorkload,
 *   sortedByWorkload (vzestupně)
 */
export function getEmployeeStatistics(employees) {

    const ages = employees.map(e => getAge(e));
    const workloads = employees.map(e => e.workload);

    const {
        total, workload10, workload20, workload30, workload40
    } = getWorkloadCounts(employees);

    const {
        averageAge,
        minAge,
        maxAge,
        medianAge
    } = getAgeStats(ages);

    const medianWorkload = Math.floor(getMedian(workloads));

    const averageWomenWorkload = getAverageWomenWorkload(employees);

    const sortedByWorkload = [...employees].sort((a, b) => a.workload - b.workload);

    return {
        total,
        workload10,
        workload20,
        workload30,
        workload40,
        averageAge,
        minAge,
        maxAge,
        medianAge,
        medianWorkload,
        averageWomenWorkload,
        sortedByWorkload
    };
}

/**
 * Hlavní funkce
 * @param {object} dtoIn Vstupní data
 * @returns {object} Výstupní DTO obsahující statistiky
 */
export function main(dtoIn) {
    const employees = generateEmployeeData(dtoIn);
    return getEmployeeStatistics(employees);
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
    const now = Date.now();
    const msYear = 365.25 * 24 * 60 * 60 * 1000;
    const youngest = now - minAge * msYear;
    const oldest = now - maxAge * msYear;
    const ts = randomInt(oldest, youngest);
    return new Date(ts).toISOString();
}

/**
 * Vrátí náhodné celé číslo
 * Použítí Math.floor nad Math.random(), aby bylo číslo celé.
 * @param {number} min - Dolní hranice (včetně)
 * @param {number} max - Horní hranice (včetně)
 * @returns {number} Náhodné celé číslo v intervalu
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Spočítá věk zaměstnance v letech jako reálné číslo.
 * Využívá rozdíl mezi aktuálním časem a datem narození vydělený
 * průměrným počtem milisekund v roce.
 * @param {object} employee Objekt zaměstnance obsahující vlastnost birthdate (ISO datum)
 * @returns {number} Věk zaměstnance v letech jako nezaokrouhlené (reálné) číslo
 */
function getAge(employee) {
    const now = Date.now();
    const msYear = 365.25 * 24 * 60 * 60 * 1000;
    return (now - new Date(employee.birthdate).getTime()) / msYear;
}

/**
 * Spočítá počty zaměstnanců podle jednotlivých úvazků.
 * @param {Array<object>} employees Pole zaměstnanců, každý má vlastnost workload (číslo)
 * @returns {object} Objekt s počty:
 *   - total {number} celkový počet zaměstnanců
 *   - workload10 {number} počet zaměstnanců s úvazkem 10
 *   - workload20 {number} počet zaměstnanců s úvazkem 20
 *   - workload30 {number} počet zaměstnanců s úvazkem 30
 *   - workload40 {number} počet zaměstnanců s úvazkem 40
 */
function getWorkloadCounts(employees) {
    let workload10 = 0, workload20 = 0, workload30 = 0, workload40 = 0;

    for (const e of employees) {
        if (e.workload === 10) workload10++;
        if (e.workload === 20) workload20++;
        if (e.workload === 30) workload30++;
        if (e.workload === 40) workload40++;
    }
    return {
        total: employees.length,
        workload10,
        workload20,
        workload30,
        workload40
    };
}

/**
 * Vypočítá průměrný věk, minimální, maximální a medián věku.
 * Pracuje s reálnými čísly věků a až na konci:
 * - averageAge zaokrouhluje na 1 desetinné místo,
 * - minAge, maxAge a medianAge ořezává pomocí Math.floor.
 * @param {Array<number>} ages Pole věků jako reálná čísla (např. 34.7)
 * @returns {object} Objekt s vlastnostmi:
 *   - averageAge {number} průměrný věk (1 desetinné místo)
 *   - minAge {number} nejnižší věk (celé číslo, floor)
 *   - maxAge {number} nejvyšší věk (celé číslo, floor)
 *   - medianAge {number} medián věku (celé číslo, floor)
 */
function getAgeStats(ages) {
    if (!ages.length) {
        return { averageAge: 0, minAge: 0, maxAge: 0, medianAge: 0 };
    }

    const sorted = [...ages].sort((a, b) => a - b);

    const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
    const averageAge = Math.round(avg * 10) / 10;

    const minAge = Math.floor(sorted[0]);
    const maxAge = Math.floor(sorted[sorted.length - 1]);

    const medianAge = Math.floor(getMedian(sorted));

    return { averageAge, minAge, maxAge, medianAge };
}

/**
 * Vypočítá medián z pole čísel.
 * Pokud je počet prvků lichý, vrátí prostřední hodnotu.
 * Pokud je sudý, vrátí průměr dvou prostředních hodnot.
 * @param {Array<number>} arr Pole čísel (není nutně setříděné)
 * @returns {number} Medián zadaného pole čísel
 */
function getMedian(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 1) return sorted[mid];
    return (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Vypočítá průměrný úvazek pouze pro ženy.
 * Pracuje pouze se zaměstnanci, kde gender === "female".
 * Výsledek je zaokrouhlen na jedno desetinné místo.
 * @param {Array<object>} employees Pole zaměstnanců
 * @returns {number} Průměrný workload žen (1 desetinné místo), nebo 0 pokud nejsou ženy
 */
function getAverageWomenWorkload(employees) {
    const women = employees.filter(e => e.gender === "female");
    if (!women.length) return 0;
    const sum = women.reduce((a, b) => a + b.workload, 0);
    return Math.round((sum / women.length) * 10) / 10;
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