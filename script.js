// Progress tracking functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize progress tracking for different pages
    initializeProgressTracking();
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Initialize popovers if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
    
    // Add smooth scrolling to all links
    addSmoothScrolling();
    
    // Initialize any page-specific functionality
    initializePageSpecificFunctionality();
});

// Function to initialize progress tracking
function initializeProgressTracking() {
    // Check if we're on a page that has progress tracking
    const progressContainers = document.querySelectorAll('.progress-tracking');
    
    if (progressContainers.length > 0) {
        progressContainers.forEach(container => {
            const trackingId = container.getAttribute('data-tracking-id');
            if (trackingId) {
                loadProgressData(trackingId, container);
                
                // Find save buttons within this container
                const saveButtons = container.querySelectorAll('.save-progress');
                saveButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        saveProgressData(trackingId, container);
                    });
                });
            }
        });
    }
    
    // Check for resource progress chart
    const resourceChart = document.getElementById('resourceProgressChart');
    if (resourceChart) {
        initializeResourceChart(resourceChart);
    }
    
    // Check for week progress tracking
    const weekTrackers = document.querySelectorAll('.week-progress');
    if (weekTrackers.length > 0) {
        initializeWeekTrackers(weekTrackers);
    }
}

// Function to load progress data from localStorage
function loadProgressData(trackingId, container) {
    const savedData = localStorage.getItem('progress_' + trackingId);
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Find all checkboxes and set their state
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            if (data.checkboxes && data.checkboxes[index] !== undefined) {
                checkbox.checked = data.checkboxes[index];
            }
        });
        
        // Find all progress bars and set their values
        const progressBars = container.querySelectorAll('.progress-bar');
        progressBars.forEach((progressBar, index) => {
            if (data.progressBars && data.progressBars[index] !== undefined) {
                progressBar.style.width = data.progressBars[index] + '%';
                progressBar.setAttribute('aria-valuenow', data.progressBars[index]);
                
                // Update any associated text
                const valueText = progressBar.parentElement.querySelector('.progress-value');
                if (valueText) {
                    valueText.textContent = data.progressBars[index] + '%';
                }
            }
        });
        
        // Find all range inputs and set their values
        const rangeInputs = container.querySelectorAll('input[type="range"]');
        rangeInputs.forEach((rangeInput, index) => {
            if (data.rangeInputs && data.rangeInputs[index] !== undefined) {
                rangeInput.value = data.rangeInputs[index];
                
                // Update any associated text
                const valueText = rangeInput.parentElement.querySelector('.range-value');
                if (valueText) {
                    valueText.textContent = data.rangeInputs[index];
                }
            }
        });
        
        // Update completion status if it exists
        const completionStatus = container.querySelector('.completion-status');
        if (completionStatus && data.completionPercentage !== undefined) {
            completionStatus.textContent = data.completionPercentage + '% Complete';
        }
    }
}

// Function to save progress data to localStorage
function saveProgressData(trackingId, container) {
    const data = {
        checkboxes: [],
        progressBars: [],
        rangeInputs: [],
        completionPercentage: 0
    };
    
    // Collect checkbox states
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        data.checkboxes.push(checkbox.checked);
    });
    
    // Calculate completion percentage based on checkboxes
    if (checkboxes.length > 0) {
        const checkedCount = data.checkboxes.filter(state => state === true).length;
        data.completionPercentage = Math.round((checkedCount / checkboxes.length) * 100);
    }
    
    // Collect progress bar values
    const progressBars = container.querySelectorAll('.progress-bar');
    progressBars.forEach(progressBar => {
        data.progressBars.push(parseInt(progressBar.getAttribute('aria-valuenow') || '0'));
    });
    
    // Collect range input values
    const rangeInputs = container.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(rangeInput => {
        data.rangeInputs.push(parseInt(rangeInput.value));
    });
    
    // Save to localStorage
    localStorage.setItem('progress_' + trackingId, JSON.stringify(data));
    
    // Update UI to show saved status
    const saveButton = container.querySelector('.save-progress');
    if (saveButton) {
        const originalText = saveButton.textContent;
        saveButton.textContent = 'Saved!';
        saveButton.classList.add('btn-success');
        saveButton.classList.remove('btn-primary');
        
        setTimeout(() => {
            saveButton.textContent = originalText;
            saveButton.classList.remove('btn-success');
            saveButton.classList.add('btn-primary');
        }, 2000);
    }
    
    // Update completion status if it exists
    const completionStatus = container.querySelector('.completion-status');
    if (completionStatus) {
        completionStatus.textContent = data.completionPercentage + '% Complete';
    }
}

// Function to initialize resource chart
function initializeResourceChart(chartCanvas) {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js is not loaded');
        return;
    }
    
    const ctx = chartCanvas.getContext('2d');
    const resourceProgressChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Computer Fundamentals',
                'Operating Systems',
                'Database Management',
                'Networking',
                'Typing Practice',
                'MS Office',
                'MCQ Practice'
            ],
            datasets: [{
                label: 'Your Progress',
                data: [0, 0, 0, 0, 0, 0, 0],
                fill: true,
                backgroundColor: 'rgba(13, 110, 253, 0.2)',
                borderColor: 'rgb(13, 110, 253)',
                pointBackgroundColor: 'rgb(13, 110, 253)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(13, 110, 253)'
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
    
    // Load saved data if available
    const savedData = localStorage.getItem('resourceProgressData');
    if (savedData) {
        const data = JSON.parse(savedData);
        resourceProgressChart.data.datasets[0].data = data.data;
        resourceProgressChart.update();
        
        // Update range inputs if they exist
        const inputIds = [
            'computerFundamentals',
            'operatingSystems',
            'databaseManagement',
            'networkingProgress',
            'typingPractice',
            'msOffice',
            'mcqPractice'
        ];
        
        inputIds.forEach((id, index) => {
            const input = document.getElementById(id);
            if (input && data.data[index] !== undefined) {
                input.value = data.data[index];
            }
        });
    }
    
    // Save resource progress data
    const saveButton = document.getElementById('saveResourceProgress');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            const inputIds = [
                'computerFundamentals',
                'operatingSystems',
                'databaseManagement',
                'networkingProgress',
                'typingPractice',
                'msOffice',
                'mcqPractice'
            ];
            
            const newData = inputIds.map(id => {
                const input = document.getElementById(id);
                return input ? parseInt(input.value) || 0 : 0;
            });
            
            resourceProgressChart.data.datasets[0].data = newData;
            resourceProgressChart.update();
            
            localStorage.setItem('resourceProgressData', JSON.stringify({
                data: newData
            }));
            
            // Close modal if it exists
            const modal = document.getElementById('resourceModal');
            if (modal && typeof bootstrap !== 'undefined') {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) {
                    bsModal.hide();
                }
            }
            
            // Show success message
            alert('Resource progress updated!');
        });
    }
}

// Function to initialize week trackers
function initializeWeekTrackers(weekTrackers) {
    weekTrackers.forEach(tracker => {
        const weekNumber = tracker.getAttribute('data-week');
        if (weekNumber) {
            // Load saved data
            const savedData = localStorage.getItem('week_' + weekNumber);
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Update checkboxes
                const checkboxes = tracker.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach((checkbox, index) => {
                    if (data.checkboxes && data.checkboxes[index] !== undefined) {
                        checkbox.checked = data.checkboxes[index];
                    }
                });
                
                // Update progress bar
                const progressBar = tracker.querySelector('.progress-bar');
                if (progressBar && data.progress !== undefined) {
                    progressBar.style.width = data.progress + '%';
                    progressBar.setAttribute('aria-valuenow', data.progress);
                    
                    // Update text if it exists
                    const progressText = tracker.querySelector('.progress-text');
                    if (progressText) {
                        progressText.textContent = data.progress + '% Complete';
                    }
                }
            }
            
            // Add event listeners to checkboxes
            const checkboxes = tracker.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    updateWeekProgress(tracker, weekNumber);
                });
            });
            
            // Initial calculation
            updateWeekProgress(tracker, weekNumber);
        }
    });
}

// Function to update week progress
function updateWeekProgress(tracker, weekNumber) {
    const checkboxes = tracker.querySelectorAll('input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const totalCount = checkboxes.length;
    const progressPercentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
    
    // Update progress bar
    const progressBar = tracker.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = progressPercentage + '%';
        progressBar.setAttribute('aria-valuenow', progressPercentage);
        
        // Update text if it exists
        const progressText = tracker.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = progressPercentage + '% Complete';
        }
    }
    
    // Save data
    const data = {
        checkboxes: Array.from(checkboxes).map(cb => cb.checked),
        progress: progressPercentage
    };
    
    localStorage.setItem('week_' + weekNumber, JSON.stringify(data));
}

// Function to add smooth scrolling to all links
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip dropdown toggles and tabs
            if (this.classList.contains('dropdown-toggle') || 
                this.getAttribute('data-bs-toggle') === 'tab' ||
                this.getAttribute('data-bs-toggle') === 'pill' ||
                this.getAttribute('data-bs-toggle') === 'collapse') {
                return;
            }
            
            // Skip if href is just "#"
            if (href === '#') {
                return;
            }
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, href);
            }
        });
    });
}

// Function to initialize page-specific functionality
function initializePageSpecificFunctionality() {
    // Check which page we're on based on the URL or page elements
    const currentPath = window.location.pathname;
    
    // Daily Schedule page functionality
    if (currentPath.includes('daily-schedule') || document.getElementById('daily-schedule-planner')) {
        initializeDailySchedulePage();
    }
    
    // MCQ Strategy page functionality
    if (currentPath.includes('mcq-strategy') || document.getElementById('mcq-tracker')) {
        initializeMCQStrategyPage();
    }
    
    // Physical Fitness page functionality
    if (currentPath.includes('physical-fitness') || document.getElementById('fitness-tracker')) {
        initializePhysicalFitnessPage();
    }
    
    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        initializeContactForm(contactForm);
    }
    
    // Print functionality
    const printButtons = document.querySelectorAll('.print-page');
    if (printButtons.length > 0) {
        printButtons.forEach(button => {
            button.addEventListener('click', function() {
                window.print();
            });
        });
    }
}

// Function to initialize daily schedule page
function initializeDailySchedulePage() {
    // Load saved schedule if available
    const savedSchedule = localStorage.getItem('daily_schedule');
    if (savedSchedule) {
        try {
            const scheduleData = JSON.parse(savedSchedule);
            
            // Populate time slots
            Object.keys(scheduleData).forEach(timeSlot => {
                const input = document.querySelector(`[data-time-slot="${timeSlot}"]`);
                if (input) {
                    input.value = scheduleData[timeSlot];
                }
            });
        } catch (e) {
            console.error('Error loading saved schedule:', e);
        }
    }
    
    // Add event listeners to save schedule
    const scheduleInputs = document.querySelectorAll('[data-time-slot]');
    scheduleInputs.forEach(input => {
        input.addEventListener('change', saveSchedule);
    });
    
    // Save schedule button
    const saveButton = document.getElementById('save-schedule');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveSchedule();
            
            // Show saved confirmation
            const originalText = saveButton.textContent;
            saveButton.textContent = 'Schedule Saved!';
            saveButton.classList.add('btn-success');
            saveButton.classList.remove('btn-primary');
            
            setTimeout(() => {
                saveButton.textContent = originalText;
                saveButton.classList.remove('btn-success');
                saveButton.classList.add('btn-primary');
            }, 2000);
        });
    }
}

// Function to save schedule
function saveSchedule() {
    const scheduleData = {};
    const scheduleInputs = document.querySelectorAll('[data-time-slot]');
    
    scheduleInputs.forEach(input => {
        const timeSlot = input.getAttribute('data-time-slot');
        scheduleData[timeSlot] = input.value;
    });
    
    localStorage.setItem('daily_schedule', JSON.stringify(scheduleData));
}

// Function to initialize MCQ strategy page
function initializeMCQStrategyPage() {
    // MCQ score calculator
    const mcqCalculator = document.getElementById('mcq-calculator');
    if (mcqCalculator) {
        const totalQuestions = document.getElementById('total-questions');
        const attemptedQuestions = document.getElementById('attempted-questions');
        const correctAnswers = document.getElementById('correct-answers');
        const calculateButton = document.getElementById('calculate-score');
        const resultDisplay = document.getElementById('score-result');
        
        if (calculateButton) {
            calculateButton.addEventListener('click', function() {
                const total = parseInt(totalQuestions.value) || 0;
                const attempted = parseInt(attemptedQuestions.value) || 0;
                const correct = parseInt(correctAnswers.value) || 0;
                
                // Validate inputs
                if (total <= 0) {
                    alert('Please enter a valid number of total questions.');
                    return;
                }
                
                if (attempted > total) {
                    alert('Attempted questions cannot exceed total questions.');
                    return;
                }
                
                if (correct > attempted) {
                    alert('Correct answers cannot exceed attempted questions.');
                    return;
                }
                
                // Calculate score with 20% negative marking
                const incorrect = attempted - correct;
                const positiveMarks = correct * 1; // Assuming 1 mark per question
                const negativeMarks = incorrect * 0.2; // 20% negative marking
                const finalScore = positiveMarks - negativeMarks;
                const maxPossibleScore = total;
                const percentage = (finalScore / maxPossibleScore) * 100;
                
                // Display result
                resultDisplay.innerHTML = `
                    <div class="alert alert-info">
                        <h5>Score Calculation:</h5>
                        <p>Correct Answers: ${correct} × 1 = +${positiveMarks.toFixed(2)}</p>
                        <p>Incorrect Answers: ${incorrect} × -0.2 = -${negativeMarks.toFixed(2)}</p>
                        <p>Final Score: ${finalScore.toFixed(2)} out of ${maxPossibleScore} (${percentage.toFixed(2)}%)</p>
                    </div>
                    <div class="alert ${percentage >= 40 ? 'alert-success' : 'alert-warning'}">
                        <h5>${percentage >= 40 ? 'Good job!' : 'Keep practicing!'}</h5>
                        <p>${percentage >= 40 ? 'You\'re on track for a good score.' : 'Focus on improving accuracy to handle negative marking effectively.'}</p>
                    </div>
                `;
            });
        }
    }
    
    // MCQ practice log
    const practiceLogForm = document.getElementById('mcq-practice-log-form');
    if (practiceLogForm) {
        // Load saved logs
        loadPracticeLogs();
        
        practiceLogForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const date = document.getElementById('practice-date').value;
            const topic = document.getElementById('practice-topic').value;
            const totalQuestions = document.getElementById('practice-total').value;
            const correctAnswers = document.getElementById('practice-correct').value;
            const timeSpent = document.getElementById('practice-time').value;
            
            if (!date || !topic || !totalQuestions || !correctAnswers || !timeSpent) {
                alert('Please fill in all fields.');
                return;
            }
            
            addPracticeLog(date, topic, totalQuestions, correctAnswers, timeSpent);
            practiceLogForm.reset();
        });
    }
}

// Function to load practice logs
function loadPracticeLogs() {
    const logsContainer = document.getElementById('practice-logs');
    if (!logsContainer) return;
    
    const savedLogs = localStorage.getItem('mcq_practice_logs');
    if (savedLogs) {
        try {
            const logs = JSON.parse(savedLogs);
            logsContainer.innerHTML = ''; // Clear existing logs
            
            if (logs.length === 0) {
                logsContainer.innerHTML = '<p class="text-muted">No practice sessions logged yet.</p>';
                return;
            }
            
            // Create table
            const table = document.createElement('table');
            table.className = 'table table-striped table-hover';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Topic</th>
                        <th>Questions</th>
                        <th>Score</th>
                        <th>Time Spent</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="logs-tbody"></tbody>
            `;
            
            logsContainer.appendChild(table);
            const tbody = document.getElementById('logs-tbody');
            
            logs.forEach((log, index) => {
                const row = document.createElement('tr');
                const score = (log.correctAnswers / log.totalQuestions) * 100;
                
                row.innerHTML = `
                    <td>${log.date}</td>
                    <td>${log.topic}</td>
                    <td>${log.totalQuestions}</td>
                    <td>${log.correctAnswers}/${log.totalQuestions} (${score.toFixed(1)}%)</td>
                    <td>${log.timeSpent} min</td>
                    <td>
                        <button class="btn btn-sm btn-danger delete-log" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-log').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    deletePracticeLog(index);
                });
            });
        } catch (e) {
            console.error('Error loading practice logs:', e);
            logsContainer.innerHTML = '<p class="text-danger">Error loading practice logs.</p>';
        }
    } else {
        logsContainer.innerHTML = '<p class="text-muted">No practice sessions logged yet.</p>';
    }
}

// Function to add practice log
function addPracticeLog(date, topic, totalQuestions, correctAnswers, timeSpent) {
    const logs = JSON.parse(localStorage.getItem('mcq_practice_logs') || '[]');
    
    logs.push({
        date,
        topic,
        totalQuestions,
        correctAnswers,
        timeSpent
    });
    
    localStorage.setItem('mcq_practice_logs', JSON.stringify(logs));
    loadPracticeLogs();
}

// Function to delete practice log
function deletePracticeLog(index) {
    if (confirm('Are you sure you want to delete this practice log?')) {
        const logs = JSON.parse(localStorage.getItem('mcq_practice_logs') || '[]');
        
        if (index >= 0 && index < logs.length) {
            logs.splice(index, 1);
            localStorage.setItem('mcq_practice_logs', JSON.stringify(logs));
            loadPracticeLogs();
        }
    }
}

// Function to initialize physical fitness page
function initializePhysicalFitnessPage() {
    // Load saved measurements
    loadFitnessMeasurements();
    
    // Measurement form
    const measurementForm = document.getElementById('fitness-measurement-form');
    if (measurementForm) {
        measurementForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const date = document.getElementById('measurement-date').value;
            const height = document.getElementById('measurement-height').value;
            const weight = document.getElementById('measurement-weight').value;
            const chest = document.getElementById('measurement-chest').value;
            const chestExpanded = document.getElementById('measurement-chest-expanded').value;
            
            if (!date || !height || !weight || !chest || !chestExpanded) {
                alert('Please fill in all fields.');
                return;
            }
            
            addFitnessMeasurement(date, height, weight, chest, chestExpanded);
            measurementForm.reset();
        });
    }
    
    // BMI calculator
    const bmiCalculator = document.getElementById('bmi-calculator');
    if (bmiCalculator) {
        const heightInput = document.getElementById('bmi-height');
        const weightInput = document.getElementById('bmi-weight');
        const calculateButton = document.getElementById('calculate-bmi');
        const resultDisplay = document.getElementById('bmi-result');
        
        if (calculateButton) {
            calculateButton.addEventListener('click', function() {
                const height = parseFloat(heightInput.value) || 0;
                const weight = parseFloat(weightInput.value) || 0;
                
                if (height <= 0 || weight <= 0) {
                    alert('Please enter valid height and weight values.');
                    return;
                }
                
                // Calculate BMI (weight in kg / height in m^2)
                const heightInMeters = height / 100;
                const bmi = weight / (heightInMeters * heightInMeters);
                
                let category = '';
                let alertClass = '';
                
                if (bmi < 18.5) {
                    category = 'Underweight';
                    alertClass = 'alert-warning';
                } else if (bmi >= 18.5 && bmi < 25) {
                    category = 'Normal weight';
                    alertClass = 'alert-success';
                } else if (bmi >= 25 && bmi < 30) {
                    category = 'Overweight';
                    alertClass = 'alert-warning';
                } else {
                    category = 'Obese';
                    alertClass = 'alert-danger';
                }
                
                resultDisplay.innerHTML = `
                    <div class="alert ${alertClass}">
                        <h5>Your BMI: ${bmi.toFixed(1)}</h5>
                        <p>Category: ${category}</p>
                        <p>For police fitness requirements, a BMI in the normal range (18.5-24.9) is generally preferred.</p>
                    </div>
                `;
            });
        }
    }
}

// Function to load fitness measurements
function loadFitnessMeasurements() {
    const measurementsContainer = document.getElementById('fitness-measurements');
    if (!measurementsContainer) return;
    
    const savedMeasurements = localStorage.getItem('fitness_measurements');
    if (savedMeasurements) {
        try {
            const measurements = JSON.parse(savedMeasurements);
            measurementsContainer.innerHTML = ''; // Clear existing measurements
            
            if (measurements.length === 0) {
                measurementsContainer.innerHTML = '<p class="text-muted">No measurements recorded yet.</p>';
                return;
            }
            
            // Create table
            const table = document.createElement('table');
            table.className = 'table table-striped table-hover';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Height (cm)</th>
                        <th>Weight (kg)</th>
                        <th>Chest (cm)</th>
                        <th>Chest Expanded (cm)</th>
                        <th>Expansion</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="measurements-tbody"></tbody>
            `;
            
            measurementsContainer.appendChild(table);
            const tbody = document.getElementById('measurements-tbody');
            
            measurements.forEach((measurement, index) => {
                const row = document.createElement('tr');
                const expansion = measurement.chestExpanded - measurement.chest;
                
                row.innerHTML = `
                    <td>${measurement.date}</td>
                    <td>${measurement.height}</td>
                    <td>${measurement.weight}</td>
                    <td>${measurement.chest}</td>
                    <td>${measurement.chestExpanded}</td>
                    <td>${expansion.toFixed(1)} cm</td>
                    <td>
                        <button class="btn btn-sm btn-danger delete-measurement" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-measurement').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    deleteFitnessMeasurement(index);
                });
            });
            
            // Add chart if Chart.js is available
            if (typeof Chart !== 'undefined' && measurements.length > 1) {
                createFitnessChart(measurements);
            }
        } catch (e) {
            console.error('Error loading fitness measurements:', e);
            measurementsContainer.innerHTML = '<p class="text-danger">Error loading measurements.</p>';
        }
    } else {
        measurementsContainer.innerHTML = '<p class="text-muted">No measurements recorded yet.</p>';
    }
}

// Function to add fitness measurement
function addFitnessMeasurement(date, height, weight, chest, chestExpanded) {
    const measurements = JSON.parse(localStorage.getItem('fitness_measurements') || '[]');
    
    measurements.push({
        date,
        height,
        weight,
        chest,
        chestExpanded
    });
    
    localStorage.setItem('fitness_measurements', JSON.stringify(measurements));
    loadFitnessMeasurements();
}

// Function to delete fitness measurement
function deleteFitnessMeasurement(index) {
    if (confirm('Are you sure you want to delete this measurement?')) {
        const measurements = JSON.parse(localStorage.getItem('fitness_measurements') || '[]');
        
        if (index >= 0 && index < measurements.length) {
            measurements.splice(index, 1);
            localStorage.setItem('fitness_measurements', JSON.stringify(measurements));
            loadFitnessMeasurements();
        }
    }
}

// Function to create fitness chart
function createFitnessChart(measurements) {
    const chartContainer = document.getElementById('fitness-chart-container');
    if (!chartContainer) return;
    
    // Clear existing chart
    chartContainer.innerHTML = '<canvas id="fitness-chart"></canvas>';
    
    const ctx = document.getElementById('fitness-chart').getContext('2d');
    
    // Prepare data
    const dates = measurements.map(m => m.date);
    const weights = measurements.map(m => parseFloat(m.weight));
    const chestMeasurements = measurements.map(m => parseFloat(m.chest));
    const chestExpanded = measurements.map(m => parseFloat(m.chestExpanded));
    const expansions = measurements.map((m, i) => parseFloat(m.chestExpanded) - parseFloat(m.chest));
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Weight (kg)',
                    data: weights,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1
                },
                {
                    label: 'Chest (cm)',
                    data: chestMeasurements,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.1
                },
                {
                    label: 'Chest Expanded (cm)',
                    data: chestExpanded,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                },
                {
                    label: 'Expansion (cm)',
                    data: expansions,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Fitness Measurements Over Time'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Function to initialize contact form
function initializeContactForm(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real implementation, this would send the form data to a server
        // For this demo, we'll just show the success message
        
        // Hide the form
        form.classList.add('d-none');
        
        // Show success message
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.classList.remove('d-none');
        }
        
        // Reset form
        form.reset();
    });
}

// Function to check if an element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to handle scroll animations
function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('animated');
        }
    });
}

// Add scroll event listener for animations
window.addEventListener('scroll', handleScrollAnimations);
