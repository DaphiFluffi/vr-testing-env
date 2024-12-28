const task1 = `class Main {

// DO NOT CHANGE
public static void main(String[] args) {
// Test Case 1
int[] result1 = twoSum(new int[] {2, 7, 11, 15}, 9); // [0,1]
printResult(result1);

// Test Case 2
int[] result2 = twoSum(new int[] {3, 2, 4}, 6); // [1,2]
printResult(result2);

// Test Case 3
int[] result3 = twoSum(new int[] {3, 3}, 6); //[0,1]
printResult(result3);

}

// YOUR TASK IS HERE:
// Please Type in the spaces below the comment and copy the text exactly

// Type This: public static int[] twoSum(int[] nums, int target) {

// Type this: for (int i = 0; i < nums.length; i++) {
    
    // Type this: for (int j = i + 1; j < nums.length; j++) {

        // Type this: if (nums[j] == target - nums[i]) {
            
            // Type This: return new int[] { i, j };

        // Type This: }

    // Type This: }

// Type This: }

// Type This: return new int[] {};

// Type This:}


// DO NOT CHANGE
private static void printResult(int[] result) {
if (result.length == 0) {
System.out.println("No valid pair found");
} else {
System.out.println("Indices: " + result[0] + ", " + result[1]);
}
}
}`;
    const task2 = `public class Example { 

// Task: Name edit
// Original: colorPanel -> Edited: strokePanel
private String colorPanel = "red"; // Please rename this to strokePanel

public static void main(String[] args) {

    // Task: Correct typos
    // Original: pblis stttc void -> Edited: public static void
    Pblis stttc void incorrectMethod() {
        System.out.println("This method has typos.");
    }

    // Task: Lists of parameters/statements
    // Insert another parameter into this function
    calculateSum(5, 10); // Change to calculateSum(5, 10, 15)

    // Add to the array
    int[] numbers = {1, 2, 3, 4, 5}; // Add 6, 7, 8 to this array

    // Add a new statement
    int x = 10;
    int y = 20;
    // Add System.out.println(x);

    // Task: Removing a parameter (delete after adding)
    calculateSum(5, 10, 15); // Remove the third parameter again

    // Task: Infix expressions
    Object obj = new Object();
    obj // Call .toString() on obj

    // Task: Literals
    double result = 123.45myVar; // Insert a \`+\` between 123.45 and myVar

    // Task: Fixing string literals
    System.out.println("Hello.); // Fix this by closing the string properly
}

// Function for parameter editing
public static int calculateSum(int a, int b) {
    return a + b;
}
}`;

    let editor;
    let logData = [];
    let taskStartTime = null;
    let timerInterval = null;
    let maxTaskTime = 7 * 60 * 1000; // 7 minutes in milliseconds //todo Max task time
    let darkMode = true;

    require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create(document.getElementById('editor-container'), {
            value: "// Select a task to load",
            language: 'java',
            theme: 'vs-dark'
        });

        document.getElementById('load-task1').onclick = () => loadTask(task1, "Task 1");
        document.getElementById('load-task2').onclick = () => loadTask(task2, "Task 2");
        document.getElementById('start-task').onclick = startTask;
        document.getElementById('stop-task').onclick = stopTask;
        document.getElementById('clear-save-logs').onclick = clearAndSaveLogs;
        document.getElementById('toggle-theme').onclick = toggleTheme;
    });

    function loadTask(task, taskName) {
        resetButtons();
        editor.setValue(task);
        console.log(`Loaded ${taskName}`);
    }

    function startTask() {
        resetButtons();
        document.getElementById('start-task').classList.add('active');
        logData = [];
        taskStartTime = Date.now();
        startTimer();

        // Automatically stop the task after the maximum time
        setTimeout(() => {
            if (taskStartTime) stopTask();
        }, maxTaskTime);
    }

    function stopTask() {
        if (!taskStartTime) return; // Prevent stopping without starting
        document.getElementById('stop-task').classList.add('active');
        saveLogs(`task_log_${new Date().toISOString()}`);
        stopTimer();
        resetButtons();
    }

    function clearAndSaveLogs() {
        saveLogs(`cleared_log_${new Date().toISOString()}`);
        editor.setValue("");
        console.log("Cleared editor and saved logs");
        resetButtons();
    }

    function saveLogs(filename) {
        const logContent = JSON.stringify(logData, null, 2);
        const blob = new Blob([logContent], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${filename}.json`;
        a.click();
    
        // Save logs to a GitHub gist
        saveLogsToGist(filename, logContent);
    }

    function startTimer() {
        const timerElement = document.getElementById('timer');
        timerInterval = setInterval(() => {
            const elapsed = Date.now() - taskStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }
    
    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('timer').textContent = "00:00";
    }

    function resetButtons() {
        document.querySelectorAll('button').forEach(button => {
            button.classList.remove('active');
        });
    }

    function toggleTheme() {
        const body = document.body;
        darkMode = !darkMode;
        body.classList.toggle('light-mode', !darkMode);
        document.getElementById('toggle-theme').textContent = darkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
        monaco.editor.setTheme(darkMode ? 'vs-dark' : 'vs');
    }

    document.addEventListener('keydown', (event) => {
        if (taskStartTime) {
            logData.push({
                key: event.key,
                timestamp: Date.now() - taskStartTime
            });
        }
    });

    const GITHUB_TOKEN = process.env.M_GITHUB_TOKEN; // Use the environment variable passed in the workflow

    async function saveLogsToGist(filename, content) {
        const response = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: 'Task logs uploaded by the VR Coding Test Environment',
                public: true,
                files: {
                    [filename]: { content },
                },
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to save logs: ${response.statusText}`);
        }
        return await response.json();
    }

    
