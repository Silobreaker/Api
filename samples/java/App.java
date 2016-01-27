import org.json.JSONObject;
import org.json.JSONTokener;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URL;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.util.Base64;
import java.security.NoSuchAlgorithmException;
import java.security.InvalidKeyException;

class Secrets
{
    public String shared;
    public String key;
}

/**
 * Reads from the Silobreaker REST API using. Authenticates using a digest.
 *
 */
public class App {

    private static final String HMAC_SHA1_ALGORITHM = "HmacSHA1";

    /**
     * Computes RFC 2104-compliant HMAC signature.
     * @param data
     * The data to be signed.
     * @param key
     * The signing key.
     * @return
     * The Base64-encoded RFC 2104-compliant HMAC signature.
     */
    public static String calculateRFC2104HMAC(String data, String key)
        throws NoSuchAlgorithmException, InvalidKeyException
    {

        // get an hmac_sha1 key from the raw key bytes
        SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(), HMAC_SHA1_ALGORITHM);

        // get an hmac_sha1 Mac instance and initialize with the signing key
        Mac mac = Mac.getInstance(HMAC_SHA1_ALGORITHM);
        mac.init(signingKey);

        // compute the hmac on input data bytes
        byte[] rawHmac = mac.doFinal(data.getBytes());

        // base64-encode the hmac
        return Base64.getEncoder().encodeToString(rawHmac);
    }

    /**
     * Reads the api and shared keys from the secrets.json file.
     * @param fname
     * The name of the file with the api keys.
     * @return
     * A Secrets object with the shared key and api key.
     * @throws
     * java.io.IOException when reading the file fails.
     */
    private static Secrets getSecretKeys(String fname) throws IOException {

        try (InputStream in = new FileInputStream(fname)) {
            JSONObject jsonObject = new JSONObject(new JSONTokener(in));

            Secrets secrets = new Secrets();
            secrets.shared = jsonObject.getString("SharedKey");
            secrets.key = jsonObject.getString("ApiKey");

            return secrets;
        }
    }

    public static JSONObject makeAPIRequest(String url) throws IOException {

        URL siloAPI = new URL(url);
        try (InputStream in = siloAPI.openStream()) {
            JSONObject resp = new JSONObject(new JSONTokener(in));
            return resp;
        }
    }

    public static void main( String[] args ) {

        if (args.length != 2) {
            System.out.println("FORMAT: authenticator secretsfile url");
            System.exit(1);
        }

        try {

            String verb = "GET";
            String baseUrl = "https://api.silobreaker.com/";
            String totalMessage = verb + " " + baseUrl + args[1];

            Secrets secrets = getSecretKeys(args[0]);
            String digest = calculateRFC2104HMAC(totalMessage, secrets.shared);
            String finalUrl = baseUrl + args[1] + "&apiKey=" + secrets.key + "&digest=" + URLEncoder.encode(digest, "UTF8");
            System.out.println(finalUrl + "\n");

            JSONObject response = makeAPIRequest(finalUrl);
            System.out.println(response.toString(2));
        } catch (UnknownHostException e) {
            System.out.println("Can't find host");
            System.exit(1);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            System.exit(1);
        }
    }
}
