<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? config('app.name') }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f7f9;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            color: #333333;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f7f9;
            padding-bottom: 40px;
        }

        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;
            font-family: sans-serif;
            color: #4a4a4a;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }

        .header {
            background-color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }

        .header img {
            max-width: 150px;
            height: auto;
        }

        .content {
            padding: 40px 30px;
        }

        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999999;
        }

        .button {
            display: inline-block;
            padding: 14px 30px;
            background-color: #007bff;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
            transition: background-color 0.3s ease;
        }

        .button:hover {
            background-color: #0056b3;
        }

        h1 {
            color: #1a1a1a;
            font-size: 24px;
            margin-top: 0;
        }

        p {
            margin-bottom: 20px;
            font-size: 16px;
        }

        .divider {
            height: 1px;
            background-color: #eeeeee;
            margin: 30px 0;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <table class="main">
            <tr>
                <td class="header">
                    <!-- Since images in emails need absolute URLs, we'd typically use a CDN or public URL. 
                         For now, we'll use a placeholder or assume the logo is accessible via the app URL -->
                    <img src="{{ config('app.url') }}/images/logo_Nobg.png" alt="{{ config('app.name') }} Logo">
                </td>
            </tr>
            <tr>
                <td class="content">
                    @yield('content')
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
                    <p>Business Consultation Platform</p>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>