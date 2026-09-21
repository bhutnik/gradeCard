//Helper function to calculate letter grade from percentage
function getGradeFromPercentage(pct){
    if(pct >= 90) return 'A+';
    if(pct >= 80) return 'A';
    if(pct >= 70) return 'B';
    if(pct >= 60) return 'C';
    if(pct >= 50) return 'D';
    if(pct >= 40) return 'E';
    return 'F';
}

//Step 1 ->Step 2: Dynamically create input rows
function generateSubjectInputs(){
    const numSubjects = parseInt(document.getElementById('num-subjects').value);

    if (isNaN(numSubjects) || numSubjects <= 0){
        alert("Please enter a valid number of subjects.");
        return;
    }

    const container = document.getElementById('subject-fields-container');
    container.innerHTML = ''; //Clear previous fields

    for(let i = 1; i <= numSubjects; i++){
        const row = document.createElement('div');
        row.className = 'subject-row';
        row.innerHTML = `
        <div>
            <label>Subject ${i} Name</label>
            <input type="text" class="sub-name" placeholder="e.g. Math" value="Subject ${i}">
        </div>
        <div>
            <label>Marks Obtained</label>
            <input type="number" class="sub-marks" min="0" placeholder="e.g. 85">
        </div>
        <div>
            <label>Max Marks</label>
            <input type="number" class="sub-max" min="1" placeholder="e.g 100" value="100">
        </div>
        `;
        container.appendChild(row);
    }

    //Switch pages
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
}

//Step 2 -> Step3: Process inputs, generate report & show alert
function calculateFinalGrades(){
    const names= document.querySelectorAll('.sub-name');
    const marks = document.querySelectorAll('.sub-marks');
    const maxes = document.querySelectorAll('.sub-max');

    let totalObtained = 0;
    let totalMax= 0;
    let hasFailedSubject= false;
    const subjectResults=[];

    for(let i = 0; i< names.length; i++){
        const subName = names[i].value.trim() || `Subject ${i + 1}`;
        const obtained = parseFloat(marks[i].value);
        const max = parseFloat(maxes[i].value);

        //Validation
        if (isNaN(obtained) || isNaN(max) || max <= 0 || obtained <0 || obtained > max){
            alert(`please enter valid marks for"${subName}". Obtained marks cannot be higher than maximum marks or lower than 0.`);
            return;
        }

        const percentage = (obtained / max) * 100;
        const grade = getGradeFromPercentage(percentage);

        if(percentage < 40) {
            hasFailedSubject = true; //Minimum passing mark per subject = 40%
        }

        totalObtained += obtained;
        totalMax += max;

        subjectResults.push({
            name: subName,
            obtained: obtained,
            max: max,
            percentage: percentage.toFixed(1),
            grade: grade
        });
    }

    //Calculate Overall Totals
    const overallPercentage = (totalObtained / totalMax)*100;
    const overallGrade = getGradeFromPercentage(overallPercentage);
    const isOverallPass = !hasFailedSubject && overallPercentage >= 40;

    //Render table Rows
    const tbody = document.getElementById('report-body');
    tbody.innerHTML = '';
    subjectResults.forEach(sub => {
        const tr = document.createElement('tr');
        tr.innerHTML=`
        <td>${sub.name}</td>
        <td>${sub.obtained}/${sub.max}</td>
        <td>${sub.percentage}%</td>
        <td><strong>${sub.grade}</strong></td>
        `;
        tbody.appendChild(tr);
    });

    //Render Summary Statistics
    document.getElementById('summary-total').innerText =`${totalObtained}/${totalMax}`;
    document.getElementById('summary-percentage').innerText = `${overallPercentage.toFixed(2)}%`;
    document.getElementById('summary-grade').innerText = overallGrade;

    const statusEl = document.getElementById('summary-status');
    statusEl.innerText = isOverallPass ? "PASSED":"FAILED";
    statusEl.className = isOverallPass ? "pass":"failed";

    //Switch to Results Page
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.remove('hidden');

    //Trigger Pass/Fail Alert Box
    setTimeout(()=> {
        if(isOverallPass){
            alert(`🎊 CONGRATULATIONS!\nYou PASSED with an overall grade of ${overallGrade}(${overallPercentage.toFixed(2)}%).`);
        }else{
            alert(`🥲 RESULT: FAILED\nYour overall percentage is ${overallPercentage.toFixed(2)}% (Grade: ${overallGrade}).`);
        }
    } ,200);

}

//Navigation Helpers
function goBackToStep1(){
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-1').classList.remove('hidden');
}

function resetCalculator(){
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('step-1').classList.remove('hidden');
    document.getElementById('num-subjects').value = '';
}