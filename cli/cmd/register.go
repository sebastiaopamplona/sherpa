package cmd

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
	"syscall"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/spf13/cobra"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/term"
)

var registerCmd = &cobra.Command{
	Use:   "register",
	Short: "Register a user",
	Run: func(cmd *cobra.Command, args []string) {
		databaseURL := os.Getenv("DATABASE_URL")
		if len(databaseURL) == 0 {
			log.Fatalln("missing env var 'DATABASE_URL'")
		}

		db, err := sqlx.Connect("postgres", databaseURL)
		if err != nil {
			log.Fatalln(fmt.Sprintf("failed to connect to db, %s", err.Error()))
		}

		name, email, password, err := credentials()
		if err != nil {
			log.Fatalln(fmt.Sprintf("failed to get email and password, %s", err.Error()))
		}

		passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
		if err != nil {
			log.Fatalln(fmt.Sprintf("failed to hash password, %s", err.Error()))
		}

		tx := db.MustBegin()
		tx.MustExec(`INSERT INTO "public"."User" ("id","name","email","password","image","createdAt","updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			uuid.NewString(), name, email, passwordHash, "https://static.thenounproject.com/png/55168-200.png", time.Now(), time.Now())
		if err := tx.Commit(); err != nil {
			log.Fatalln(fmt.Sprintf("failed to register user, %s", err.Error()))
		}

		log.Println("User registerd successfully")
	},
}

func init() {
	userCmd.AddCommand(registerCmd)
}

func credentials() (string, string, string, error) {
	reader := bufio.NewReader(os.Stdin)

	fmt.Print("Name: ")
	name, err := reader.ReadString('\n')
	if err != nil {
		return "", "", "", err
	}

	fmt.Print("Email: ")
	email, err := reader.ReadString('\n')
	if err != nil {
		return "", "", "", err
	}

	fmt.Print("Password: ")
	bytePassword, err := term.ReadPassword(int(syscall.Stdin))
	if err != nil {
		return "", "", "", err
	}

	password := string(bytePassword)
	return strings.TrimSpace(name), strings.TrimSpace(email), strings.TrimSpace(password), nil
}
