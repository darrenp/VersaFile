SERVER_HOST=admin.versatest.com:3000
#SERVER_HOST=admin.bfreetest.com:3000
#SERVER_HOST=admin.versafiledev.com

echo LOGON
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -d "{\"username\":\"admin\",\"password\":\"admin\"}" \
    http://$SERVER_HOST/rko_users/logon
echo
echo ================================================
echo
echo                                                ls


echo GET TOKEN
echo ================================================
auth_token=$( \
    curl \
        -v \
        -b cookies.txt \
        -c cookies.txt \
        -H "Accept:application/json,application/javascript" \
        -H "Content-Type:application/json" \
        http://$SERVER_HOST/accounts/get_token \
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
    -X POST \
    -d "{ \
            \"authenticity_token\":\"$auth_token\",
            \"email\":\"scotth@rkosolutions.com\", \
            \"password\":\"password\", \
            \"name\":\"Springfield Nuclear Power Plant\", \
            \"first_name\":\"C. Montgomery\", \
            \"last_name\":\"Burns\", \
            \"address\":\"55 Water Street, Suite 503\", \
            \"city\":\"Vancouver\", \
            \"province\":\"BC\", \
            \"country\":\"CA\", \
            \"postal_code\":\"V6B 1A1\", \
            \"account_type\":0, \
            \"billing_type\":0, \
            \"trial_period\":60, \
            \"template\": 0, \
            \"subdomains\": [ { \"name\":\"nuke\", \"user_quota\":3, \"disk_quota\": 12 } ] \
        }" \
    http://$SERVER_HOST/accounts
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
    -d "{\"authenticity_token\":\"$auth_token\"}" \
    http://$SERVER_HOST/rko_users/logoff
echo
echo ================================================
echo
echo

rm ./cookies.txt