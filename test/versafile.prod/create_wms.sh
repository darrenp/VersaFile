SERVER_HOST=https://admin.versafile.com

echo LOGON
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -k \
    -d "{\"username\":\"admin\",\"password\":\"admin\"}" \
    $SERVER_HOST/rko_users/logon
echo
echo ================================================
echo
echo

echo GET TOKEN
echo ================================================
auth_token=$( \
    curl \
        -v \
        -b cookies.txt \
        -c cookies.txt \
        -H "Accept:application/json,application/javascript" \
        -H "Content-Type:application/json" \
        -k \
        $SERVER_HOST/accounts/get_token \
)
echo
echo ================================================
echo
echo

echo CREATE
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -k \
    -X POST \
    -d "{ \
            \"authenticity_token\":\"$auth_token\",
            \"email\":\"sepands@versafile.com\", \
            \"password\":\"dont4get\", \
            \"name\":\"Westside Montessori School\", \
            \"first_name\":\"Bettina\", \
            \"last_name\":\"Tioseco\", \
            \"address\":\"4157 Oak Street\", \
            \"city\":\"Vancouver\", \
            \"province\":\"BC\", \
            \"country\":\"CA\", \
            \"postal_code\":\"V6H 2N1\", \
            \"phone\":\"604-731-6594\", \
            \"account_type\":0, \
            \"billing_type\":0, \
            \"trial_period\":65535, \
            \"template\": 0, \
            \"subdomains\": [ { \"name\":\"wsm\", \"user_quota\":3, \"disk_quota\": 10 } ] \
        }" \
    $SERVER_HOST/accounts
echo
echo ================================================
echo
echo

echo LOGOFF
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -k \
    -d "{\"authenticity_token\":\"$auth_token\"}" \
    $SERVER_HOST/rko_users/logoff
echo
echo ================================================
echo
echo

rm ./cookies.txt
