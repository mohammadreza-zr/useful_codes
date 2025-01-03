package main

import (
	"flag"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

var supportedExtensions = []string{"svg", "jpg", "png", "jpeg"}

func checkArrayHasDuplicateValue(list []string, value string) bool {
	count := 0
	for _, item := range list {
		if strings.Split(item, ".")[0] == value {
			count++
		}
	}
	return count > 1
}

func createIndex(dir string, files []string) {
	var str strings.Builder

	// Create imports for each file
	for _, file := range files {
		filePath := filepath.Join(dir, file)
		if isSupportedImage(file) && !isDirectory(filePath) {
			// Handling for duplicate names
			fileName := formatFileName(file)
			str.WriteString(fmt.Sprintf(`import %s from "./%s";%s`, fileName, file, "\n"))
		}
	}

	dirName := filepath.Base(dir)
	if startsWithDigit(dirName) {
		dirName = "dir" + dirName
	}

	// Capitalize the first letter of the directory name for export object
	exportName := capitalizeFirstLetter(formatName(dirName))

	// Export statement for the object containing the images
	str.WriteString(fmt.Sprintf("\nexport const %s = {%s", exportName, "\n"))

	for _, file := range files {
		filePath := filepath.Join(dir, file)
		if isSupportedImage(file) && !isDirectory(filePath) {
			fileName := formatFileName(file)
			if checkArrayHasDuplicateValue(files, file) {
				str.WriteString(fmt.Sprintf(`"%s": %s,%s`, formatFileName(file), fileName, "\n"))
			} else {
				str.WriteString(fmt.Sprintf(`%s: %s,%s`, fileName, fileName, "\n"))
			}
		}
	}

	str.WriteString("};\n")
	writeToFile(filepath.Join(dir, "index.ts"), str.String())
}

func isSupportedImage(file string) bool {
	ext := strings.ToLower(filepath.Ext(file))
	for _, supported := range supportedExtensions {
		if ext == "."+supported {
			return true
		}
	}
	return false
}

func isDirectory(filePath string) bool {
	fileInfo, err := os.Stat(filePath)
	return err == nil && fileInfo.IsDir()
}

func startsWithDigit(name string) bool {
	return strings.IndexFunc(name, func(r rune) bool {
		return '0' <= r && r <= '9'
	}) == 0
}

func formatFileName(file string) string {
	fileName := strings.Split(file, ".")[0]
	// Replace dashes with underscores
	fileName = strings.ReplaceAll(fileName, "-", "_")
	if startsWithDigit(fileName) {
		fileName = "img" + fileName
	}
	return fileName
}

func formatName(name string) string {
	return strings.ReplaceAll(name, ".", "_")
}

// Capitalize the first letter of the string
func capitalizeFirstLetter(str string) string {
	return strings.ToUpper(string(str[0])) + str[1:]
}

func writeToFile(path, content string) {
	file, err := os.Create(path)
	if err != nil {
		fmt.Println("Error creating file:", err)
		return
	}
	defer file.Close()

	_, err = file.WriteString(content)
	if err != nil {
		fmt.Println("Error writing to file:", err)
	}
}

func walkDir(dir string) {
	// Read the contents of the directory
	err := filepath.Walk(dir, func(filePath string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		// Process directories and files
		if info.IsDir() {
			files, err := os.ReadDir(filePath)
			if err != nil {
				return err
			}

			var filesList []string
			for _, f := range files {
				filesList = append(filesList, f.Name())
			}

			// If it contains any supported image, create an index
			for _, file := range filesList {
				if isSupportedImage(file) {
					createIndex(filePath, filesList)
					break
				}
			}

			// Recursively walk through subdirectories
			return nil
		}
		return nil
	})
	if err != nil {
		fmt.Println("Error walking through directories:", err)
	}
}

// displayHelp shows the help menu
func displayHelp() {
	fmt.Println("Usage: go run generateIndex.go <relative-image-directory-path>")
	fmt.Println()
	fmt.Println("Options:")
	fmt.Println("  -h, --help      Show this help message")
	fmt.Println()
	fmt.Println("Example:")
	fmt.Println("  go run generateIndex.go ../src/assets")
	fmt.Println("This will recursively process the 'assets' directory and generate index.ts files for each folder containing image files.")
}

func runPrettier(dir string) {
	cmd := exec.Command("npx", "prettier", "--write", dir)
	err := cmd.Run()
	if err != nil {
		fmt.Println("Error running Prettier:", err)
	} else {
		fmt.Println("Prettier formatting completed.")
	}
}

func main() {
	// Define help flag
	helpFlag := flag.Bool("h", false, "Show help")
	helpLongFlag := flag.Bool("help", false, "Show help")
	// Parse the flags
	flag.Parse()

	// Check if the help flag is provided
	if *helpFlag || *helpLongFlag {
		displayHelp()
		return
	}

	// Check if the directory argument is provided
	if len(flag.Args()) < 1 {
		displayHelp()
		return
	}

	// Get the relative directory path from command line argument
	directoryPath := flag.Args()[0]
	walkDir(directoryPath)

	// Run Prettier after generating the index.ts files
	runPrettier(directoryPath)
}
