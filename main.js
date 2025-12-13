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
    //    U ženských příjmení vytvořeno samostatné pole, protože nefungovalo mechanicky přidat "-ová" k mužskému příjmení (např. Outrata -> Outrataová, Pokorný->Pokornýová apod. není správně)
    const maleSurnames = ["Novák", "Svoboda", "Dvořák", "Černý", "Procházka", "Kučera", "Outrata", "Pokorný", "Král", "Sedláček"];
    const femaleSurnames = ["Nováková", "Svobodová", "Dvořáková", "Černá", "Procházková", "Kučerová", "Outratová", "Pokorná", "Králová", "Sedláčková"];
     // Úvazky dle zadání: 10 / 20 / 30 / 40 hodin týdně.
    const workloads = [10, 20, 30, 40];

    const result = [];
// generování tolika zaměstnanců, kolik je v dtoIn.count.
    for (let i = 0; i < dtoIn.count; i++) {
         // Pohlaví určíme náhodně (pravděpodobnost 50:50).
        const gender = Math.random() < 0.5 ? "male" : "female";
  // Podle pohlaví vybereme křestní jméno z příslušného pole.
        const name = gender === "male"
            ? maleNames[randomInt(0, maleNames.length - 1)]
            : femaleNames[randomInt(0, femaleNames.length - 1)];
 // Podle pohlaví vybereme příjmení (mužské / ženské).
        const surname = gender === "male"
            ? maleSurnames[randomInt(0, maleSurnames.length - 1)]
            : femaleSurnames[randomInt(0, femaleSurnames.length - 1)];
 // Náhodně vybereme jeden z povolených úvazků (10 / 20 / 30 / 40).
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
 * Funkce pro vrácení statistik
 * @param {Array<object>} employees Pole zaměstanců
 * @returns {object} Obsahuje statistiky:
 *   total, workload10, workload20, workload30, workload40,
 *   averageAge, minAge, maxAge, medianAge,
 *   medianWorkload, averageWomenWorkload,
 *   sortedByWorkload (vzestupně)
 */
export function getEmployeeStatistics(employees) {

    const ages = employees.map(e => getAge(e)); //vytvoření nového pole a uloží se do něj výsledek getAge, výsledkem je pole reálných věků
    const workloads = employees.map(e => e.workload); //vezme workload každého zaměstnance

    const {  //spočítání kolik lidí je s jednotlivýmo workloady a uložení do proměnných
        total, workload10, workload20, workload30, workload40   
    } = getWorkloadCounts(employees);

    const { //získání věkových statistik a uložení do proměnných
        averageAge,
        minAge,
        maxAge,
        medianAge
    } = getAgeStats(ages);

    const medianWorkload = Math.floor(getMedian(workloads)); //zavolání funkce nad polem workloadů a výsledek zaokrouhlí dolů

    const averageWomenWorkload = getAverageWomenWorkload(employees); //výpočet průměru workloadu u žen

    const sortedByWorkload = [...employees].sort((a, b) => a.workload - b.workload); //vytvoření kopie pole zaměstnanců a seřazení od nejmenšího po největší

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
    const employees = generateEmployeeData(dtoIn);  //volání funkce pro generování zaměstnanců
    return getEmployeeStatistics(employees); //vložení zaměstnanců do funkce a vrácení výsledku
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
    const now = Date.now();  //aktuální čas v ms
    const msYear = 365.25 * 24 * 60 * 60 * 1000; //počet ms v roce včetně přestupných
    return (now - new Date(employee.birthdate).getTime()) / msYear;  //výpočet rozdílu času mezi aktuální časem a datem narození, výsledek je věk v ms, ten se pak vydělí počtem ms v roce a výsledkem je věk jako reální číslo v letech
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
    let workload10 = 0, workload20 = 0, workload30 = 0, workload40 = 0;  //inicializace 

    for (const e of employees) { //projde každého zaměstnance a pokud má daný workload, přičte jedna a vloží hodnotu do proměnné
        if (e.workload === 10) workload10++;
        if (e.workload === 20) workload20++;
        if (e.workload === 30) workload30++;
        if (e.workload === 40) workload40++;
    }
    return { //vrátí objekt s počty lidí pro každý workload
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
    if (!ages.length) {   //pokud je pole prázdné, vrátí nuly
        return { averageAge: 0, minAge: 0, maxAge: 0, medianAge: 0 };
    }

    const sorted = [...ages].sort((a, b) => a - b); //vytvoření kopie pole a seřazení vzestupně

    const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length; //spočítání průměrného věku (součet všech věků a vydělení jejich počtem), výsledek je reálné číslo
    const averageAge = Math.round(avg * 10) / 10; //zaokrouhlení na jedno desetinné místo

    const minAge = Math.floor(sorted[0]); //po seřrazení vezme nejmenší věk a zaoukrohlí dolů
    const maxAge = Math.floor(sorted[sorted.length - 1]); //po seřrazení vezme největší věk a zaoukrohlí dolů

    const medianAge = Math.floor(getMedian(sorted)); //spočítá medián (zavoláním funkce getMedian s argumentem seřazeného pole věků) a ořízne dolů

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
    const sorted = [...arr].sort((a, b) => a - b);  //seřazení kopie pole
    const mid = Math.floor(sorted.length / 2); //najde prostřední index 
    if (sorted.length % 2 === 1) return sorted[mid]; //pokud je počet prvků lichý, vrací prostřední hodnotu
    return (sorted[mid - 1] + sorted[mid]) / 2; //u sudého počtu prvků vypočítá průměr dvou prostředních hodnot
}

/**
 * Vypočítá průměrný úvazek pouze pro ženy.
 * Pracuje pouze se zaměstnanci, kde gender === "female".
 * Výsledek je zaokrouhlen na jedno desetinné místo.
 * @param {Array<object>} employees Pole zaměstnanců
 * @returns {number} Průměrný workload žen (1 desetinné místo), nebo 0 pokud nejsou ženy
 */
function getAverageWomenWorkload(employees) {
    const women = employees.filter(e => e.gender === "female"); //vybere jen ženy
    if (!women.length) return 0; //pokud tam není žádná žena, vrací se nula
    const sum = women.reduce((a, b) => a + b.workload, 0); //součet workloadů žen
    return Math.round((sum / women.length) * 10) / 10; //spočítání průměrného workloadu a zaokrouhlení dolů
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